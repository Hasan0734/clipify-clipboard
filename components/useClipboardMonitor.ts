"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  startListening,
  stopMonitor as stopListening,
  onClipboardUpdate,
  onTextUpdate,
  hasText,
} from "tauri-plugin-clipboard-api";

export function useClipboardMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [clipboardText, setClipboardText] = useState("");
  const [hasClipboardText, setHasClipboardText] = useState(false);

  const unlistenClipboardRef = useRef<(() => void) | null>(null);
  const unlistenTextRef = useRef<(() => void) | null>(null);
  const isActiveRef = useRef(false);

  const cleanupListeners = async () => {
    if (unlistenClipboardRef.current) {
      unlistenClipboardRef.current();
      unlistenClipboardRef.current = null;
    }
    if (unlistenTextRef.current) {
      unlistenTextRef.current();
      unlistenTextRef.current = null;
    }

    if (isActiveRef.current) {
      await stopListening().catch(() => {});
      isActiveRef.current = false;
    }
  };

  const startMonitor = useCallback(async () => {
    // if already running, skip
    if (isActiveRef.current) return;

    // just to be safe, cleanup any old listeners
    await cleanupListeners();

    try {
      await startListening();
      isActiveRef.current = true;

      const unlistenClipboard = await onClipboardUpdate(async () => {
        const has = await hasText();
        setHasClipboardText(has);
      });

      const unlistenText = await onTextUpdate((newText) => {
        setClipboardText(newText);
      });

      unlistenClipboardRef.current = unlistenClipboard;
      unlistenTextRef.current = unlistenText;

      setIsMonitoring(true);
    } catch (err) {
      console.error("Failed to start clipboard monitor:", err);
    }
  }, []);

  const stopMonitor = useCallback(async () => {
    await cleanupListeners();
    setIsMonitoring(false);
  }, []);

  // On unmount cleanup
  useEffect(() => {
    return () => {
      cleanupListeners();
    };
  }, []);

  return {
    isMonitoring,
    clipboardText,
    hasClipboardText,
    startMonitor,
    stopMonitor,
  };
}
