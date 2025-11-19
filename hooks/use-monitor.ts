"use client";

import React, { useState, useEffect } from "react";
import { UnlistenFn } from "@tauri-apps/api/event";
import {
  isMonitorRunning,
  listenToMonitorStatusUpdate,
  onTextUpdate,
  startListening,
  stopMonitor,
} from "tauri-plugin-clipboard-api";
import { useClipboardStore } from "@/store/useClipboardStore";

export const useMonitor = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const { addItem } = useClipboardStore();

  useEffect(() => {
    let clipboardUnlisten: UnlistenFn;
    let statusUnlisten: UnlistenFn;

    const setupSubscriptions = async () => {

      const checkRunning = await isMonitorRunning();
      setIsRunning(checkRunning)

      clipboardUnlisten = await onTextUpdate((text) => {
        addItem({ content: text });
      });

     
      statusUnlisten = await listenToMonitorStatusUpdate((running) => {
        setIsRunning(running);
      });
    };

    // const checkMonitorRunning = async () => {

    // }


    setupSubscriptions();

    return () => {
      if (clipboardUnlisten) {
        clipboardUnlisten();
      }
      if (statusUnlisten) {
        statusUnlisten();
      }
    };
  }, []);


  const handleStartListen = async () => {
    const rn = await isMonitorRunning();
    if (rn) return;
    await startListening();
  };

  const handleStopListen = async () => {
    const rn = await isMonitorRunning();
    if (!rn) return;
    await stopMonitor();
  };
  return {
    isRunning,
    handleStartListen,
    handleStopListen,
  };
};
