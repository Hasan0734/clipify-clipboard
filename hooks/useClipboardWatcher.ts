import { onTextUpdate } from "tauri-plugin-clipboard-api";
import { useClipboardStore } from "@/store/useClipboardStore";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function useClipboardWatcher() {
  const setActiveCopiedText = useAppStore((s) => s.setActiveCopiedText);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    async function init() {
      unlisten = await onTextUpdate((text) => {
        console.log("Clipboard changed:", text);
        setActiveCopiedText(text);
      });
    }

    init();

    return () => {
      if (unlisten) unlisten();
    };
  }, [setActiveCopiedText]);
}
