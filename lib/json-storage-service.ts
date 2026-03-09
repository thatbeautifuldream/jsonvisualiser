import Dexie, { type Table } from "dexie";

const DB_NAME = "JSON_VISUALISER_TAB_STATE";
const TAB_ID_STORAGE_KEY = "json-visualiser-tab-id";
const CHANNEL_NAME = "json-visualiser-tab-sync";
const CLOSE_MARKER_PREFIX = "json-visualiser-tab-close:";
const CLOSED_TAB_GRACE_PERIOD_MS = 15_000;

type TTabState = {
  tabId: string;
  content: string;
  createdAt: number;
  updatedAt: number;
};

type TTabChannelMessage =
  | {
      type: "who-has-tab-id";
      tabId: string;
      requestId: string;
      from: string;
    }
  | {
      type: "tab-id-in-use";
      tabId: string;
      requestId: string;
      from: string;
    };

class JsonTabStateDB extends Dexie {
  tabStates!: Table<TTabState>;

  constructor() {
    super(DB_NAME);
    this.version(1).stores({
      tabStates: "tabId, updatedAt, createdAt",
    });
  }
}

const db = new JsonTabStateDB();

class JsonStorageService {
  private readonly instanceId =
    typeof crypto !== "undefined" ? crypto.randomUUID() : `${Date.now()}`;
  private channel: BroadcastChannel | null = null;
  private resolvedTabId: string | null = null;
  private tabIdPromise: Promise<string> | null = null;
  private hasCleanupHandler = false;

  private getChannel() {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
      return null;
    }
    if (!this.channel) {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.addEventListener("message", this.handleChannelMessage);
    }
    return this.channel;
  }

  private handleChannelMessage = (event: MessageEvent<TTabChannelMessage>) => {
    const data = event.data;
    if (!data || data.type !== "who-has-tab-id") {
      return;
    }
    if (!this.resolvedTabId || data.from === this.instanceId) {
      return;
    }
    if (data.tabId !== this.resolvedTabId) {
      return;
    }

    this.channel?.postMessage({
      type: "tab-id-in-use",
      tabId: data.tabId,
      requestId: data.requestId,
      from: this.instanceId,
    } satisfies TTabChannelMessage);
  };

  private async hasTabConflict(tabId: string): Promise<boolean> {
    const channel = this.getChannel();
    if (!channel) {
      return false;
    }

    return new Promise<boolean>((resolve) => {
      const requestId = crypto.randomUUID();
      let hasConflict = false;

      const onMessage = (event: MessageEvent<TTabChannelMessage>) => {
        const data = event.data;
        if (!data || data.type !== "tab-id-in-use") {
          return;
        }
        if (data.from === this.instanceId) {
          return;
        }
        if (data.requestId === requestId && data.tabId === tabId) {
          hasConflict = true;
        }
      };

      channel.addEventListener("message", onMessage);
      channel.postMessage({
        type: "who-has-tab-id",
        tabId,
        requestId,
        from: this.instanceId,
      } satisfies TTabChannelMessage);

      window.setTimeout(() => {
        channel.removeEventListener("message", onMessage);
        resolve(hasConflict);
      }, 120);
    });
  }

  private async resolveUniqueTabId(): Promise<string> {
    if (typeof window === "undefined") {
      return "server";
    }

    let candidate =
      sessionStorage.getItem(TAB_ID_STORAGE_KEY) ?? crypto.randomUUID();

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const conflict = await this.hasTabConflict(candidate);
      if (!conflict) {
        break;
      }
      candidate = crypto.randomUUID();
    }

    sessionStorage.setItem(TAB_ID_STORAGE_KEY, candidate);
    this.resolvedTabId = candidate;
    return candidate;
  }

  async getOrCreateTabId(): Promise<string> {
    if (this.resolvedTabId) {
      return this.resolvedTabId;
    }

    if (!this.tabIdPromise) {
      this.tabIdPromise = this.resolveUniqueTabId();
    }

    const tabId = await this.tabIdPromise;
    this.clearCloseMarker(tabId);
    return tabId;
  }

  async getTabState(tabId: string): Promise<TTabState | null> {
    const state = await db.tabStates.get(tabId);
    return state ?? null;
  }

  async saveTabState(tabId: string, content: string): Promise<void> {
    const now = Date.now();
    const existing = await db.tabStates.get(tabId);
    await db.tabStates.put({
      tabId,
      content,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
  }

  async deleteTabState(tabId: string): Promise<void> {
    await db.tabStates.delete(tabId);
  }

  async cleanupStaleTabs(cutoffMs: number): Promise<number> {
    const stale = await db.tabStates.where("updatedAt").below(cutoffMs).toArray();
    if (stale.length === 0) {
      return 0;
    }

    await db.tabStates.bulkDelete(stale.map((item) => item.tabId));
    return stale.length;
  }

  private getCloseMarkerKey(tabId: string) {
    return `${CLOSE_MARKER_PREFIX}${tabId}`;
  }

  private markTabClosing(tabId: string) {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(this.getCloseMarkerKey(tabId), `${Date.now()}`);
  }

  private clearCloseMarker(tabId: string) {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.removeItem(this.getCloseMarkerKey(tabId));
  }

  async cleanupClosedTabs(
    gracePeriodMs: number = CLOSED_TAB_GRACE_PERIOD_MS
  ): Promise<number> {
    if (typeof window === "undefined") {
      return 0;
    }

    const now = Date.now();
    const markers: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CLOSE_MARKER_PREFIX)) {
        markers.push(key);
      }
    }

    let deletedCount = 0;
    for (const key of markers) {
      const tabId = key.slice(CLOSE_MARKER_PREFIX.length);
      const markedAt = Number(localStorage.getItem(key) ?? "0");
      if (!Number.isFinite(markedAt) || now - markedAt < gracePeriodMs) {
        continue;
      }

      const hasConflict = await this.hasTabConflict(tabId);
      if (!hasConflict) {
        await this.deleteTabState(tabId);
        deletedCount += 1;
      }
      localStorage.removeItem(key);
    }

    return deletedCount;
  }

  registerLifecycleCleanup() {
    if (typeof window === "undefined" || this.hasCleanupHandler) {
      return;
    }
    this.hasCleanupHandler = true;

    const markCurrentTabClosing = () => {
      const tabId = this.resolvedTabId ?? sessionStorage.getItem(TAB_ID_STORAGE_KEY);
      if (!tabId) {
        return;
      }
      this.markTabClosing(tabId);
    };

    window.addEventListener("pagehide", markCurrentTabClosing);
    window.addEventListener("beforeunload", markCurrentTabClosing);
  }
}

export const indexedDBService = new JsonStorageService();
