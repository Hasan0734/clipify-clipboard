"use client";
import { useEffect } from "react";
import { readText } from "tauri-plugin-clipboard-api";
import { useClipboardStore } from "@/store/useClipboardStore";

export function useFocusedPasteListener() {
  const { addItem } = useClipboardStore((s) => s);

  useEffect(() => {
    async function handlePasteShortcut(e: KeyboardEvent) {
      const isPaste = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v";
      if (!isPaste) return;

      e.preventDefault();
      try {
        const content = await readText();
        if (content && content.trim().length > 0) {
          addItem({ content });
          console.log("it's from keyboard")
        }
      } catch (error) {
        console.error("past error: ", error);
      }
    }

    window.addEventListener("keydown", handlePasteShortcut);

    return () => window.removeEventListener("keydown", handlePasteShortcut);
  }, []);
}
