"use client";
import { useEffect } from "react";
import { isMonitorRunning, readText } from "tauri-plugin-clipboard-api";
import { useClipboardStore2 } from "@/store/useClipboardStore";
import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";

export function useFocusedPasteListener() {
  const {addItem} = useClipboardStore2((s) => s);
  

  useEffect(() => {
    async function handlePasteShortcut(e:KeyboardEvent) {
      const isPaste = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v";
      if(!isPaste) return;


      e.preventDefault();
      try {
        const content = await readText();
        if(content && content.trim().length > 0) {
          addItem({content});
          console.log('is saved')
        }
      } catch (error) {
        console.error("past error: ", error)
      }
    }

    window.addEventListener("keydown", handlePasteShortcut);

    return () => window.removeEventListener("keydown", handlePasteShortcut)
  }, []);
}
