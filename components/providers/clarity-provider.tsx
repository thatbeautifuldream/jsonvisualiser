"use client";

import clarity from "@microsoft/clarity";
import { useEffect } from "react";
import { env } from "@/env";

export default function ClarityProvider() {
	useEffect(() => {
		if (typeof window !== "undefined") {
			clarity.init(env.NEXT_PUBLIC_CLARITY_ID);
		}
	}, []);

	return null;
}
