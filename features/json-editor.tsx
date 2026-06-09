"use client";

import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import { foldAll, unfoldAll, foldGutter } from "@codemirror/language";
import { EditorView, keymap } from "@codemirror/view";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";

export type TJsonEditorHandle = {
	getValue: () => string;
	setValue: (value: string) => void;
	foldAll: () => void;
	unfoldAll: () => void;
};

type TJsonEditorProps = {
	value: string;
	onChange: (value: string | undefined) => void;
	theme: "light" | "dark";
	className?: string;
};

const editorFont = EditorView.theme({
	"&": { fontSize: "12px", height: "100%" },
	".cm-content": { fontFamily: "var(--font-geist-mono)" },
	".cm-gutters": { fontFamily: "var(--font-geist-mono)" },
});

export const JsonEditor = forwardRef<TJsonEditorHandle, TJsonEditorProps>(
	function JsonEditor({ value, onChange, theme, className = "" }, ref) {
		const cmRef = useRef<ReactCodeMirrorRef>(null);

		useImperativeHandle(ref, () => ({
			getValue: () => cmRef.current?.view?.state.doc.toString() ?? "",
			setValue: (next: string) => {
				const view = cmRef.current?.view;
				if (!view) return;
				view.dispatch({
					changes: { from: 0, to: view.state.doc.length, insert: next },
				});
			},
			foldAll: () => {
				const view = cmRef.current?.view;
				if (view) foldAll(view);
			},
			unfoldAll: () => {
				const view = cmRef.current?.view;
				if (view) unfoldAll(view);
			},
		}));

		const extensions = useMemo(
			() => [
				json(),
				linter(jsonParseLinter()),
				lintGutter(),
				foldGutter(),
				EditorView.lineWrapping,
				editorFont,
				keymap.of([
					{
						key: "Mod-k Mod-0",
						run: (view) => {
							foldAll(view);
							return true;
						},
					},
					{
						key: "Mod-k Mod-j",
						run: (view) => {
							unfoldAll(view);
							return true;
						},
					},
				]),
			],
			[],
		);

		return (
			<div className={`h-full ${className}`}>
				<CodeMirror
					ref={cmRef}
					value={value}
					height="100%"
					style={{ height: "100%" }}
					theme={theme}
					extensions={extensions}
					onChange={(next) => onChange(next)}
					basicSetup={{
						lineNumbers: true,
						foldGutter: false,
						bracketMatching: true,
						highlightActiveLine: true,
						tabSize: 2,
					}}
				/>
			</div>
		);
	},
);
