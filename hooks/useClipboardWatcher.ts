import { onTextUpdate } from "tauri-plugin-clipboard-api";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function useClipboardWatcher() {
  const setActiveCopiedText = useAppStore((s) => s.setActiveCopiedText);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    async function init() {
      unlisten = await onTextUpdate((text) => {
        setActiveCopiedText(text);
      });
    }

    init();

    return () => {
      if (unlisten) unlisten();
    };
  }, [setActiveCopiedText]);
}
