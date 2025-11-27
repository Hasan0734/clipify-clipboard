"use client";

import { useEffect } from "react";
import { TrayIcon } from "@tauri-apps/api/tray";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { defaultWindowIcon } from "@tauri-apps/api/app";

import {
  isMonitorRunning,
  listenToMonitorStatusUpdate,
  startListening,
  stopMonitor,
  writeText,
} from "tauri-plugin-clipboard-api";

import { useClipboardStore } from "@/store/useClipboardStore";

// -----------------------------------------------------
// 🔥 GLOBAL SINGLETON STATE — persists across reloads
// -----------------------------------------------------
let trayCreated = false;
let tray: TrayIcon | null = null;

// Store menu references so we can modify text later
let recentItem: MenuItem | null = null;
let previousItem: MenuItem | null = null;
let monitorItem: MenuItem | null = null;

// Global clipboard cache (React state won't work in tray actions)
let GLOBAL_CLIPS: any[] = [];

const TrayMenuHandler = () => {
  const { mostRecentItems } = useClipboardStore();

  // -----------------------------------------------------
  // 🔥 Keep global clip list always updated
  // -----------------------------------------------------
  useEffect(() => {
    GLOBAL_CLIPS = mostRecentItems;
  }, [mostRecentItems]);

  // -----------------------------------------------------
  // 🔥 Create tray once (survives HMR + reload)
  // -----------------------------------------------------
  useEffect(() => {
    if (trayCreated) return; // Prevent duplicate tray icons
    trayCreated = true;

    const setupTray = async () => {
      try {
        tray = await TrayIcon.new({
          id: "main-tray",
          tooltip: "Smart Clipboard Manager",
          menuOnLeftClick: true,
        });

        await tray.setIcon(await defaultWindowIcon());

        // -----------------------------
        // Create menu items
        // -----------------------------
        recentItem = await MenuItem.new({
          id: "current",
          text: "Current Clip",
          action: async () => {
            if (GLOBAL_CLIPS[0]) {
              await writeText(GLOBAL_CLIPS[0].content);
            }
          },
        });

        previousItem = await MenuItem.new({
          id: "previous",
          text: "Previous Clip",
          action: async () => {
            if (GLOBAL_CLIPS[1]) {
              await writeText(GLOBAL_CLIPS[1].content);
            }
          },
        });

        monitorItem = await MenuItem.new({
          id: "toggle_monitor",
          text: "Start Monitor",
          action: async () => {
            const running = await isMonitorRunning();
            running ? await stopMonitor() : await startListening();
          },
        });

        const reopenItem = await MenuItem.new({
          id: "reopen",
          text: "Open App",
          action: async () => {
            const win = await getCurrentWindow();
            win.show();
            win.setFocus();
          },
        });

        const quitItem = await MenuItem.new({
          id: "quit",
          text: "Quit",
          action: async () => {
            const win = await getCurrentWindow();
            win.destroy();
          },
        });

        const separator = await PredefinedMenuItem.new({ item: "Separator" });

        const menu = await Menu.new({
          items: [
            recentItem,
            previousItem,
            separator,
            monitorItem,
            reopenItem,
            quitItem,
          ],
        });

        await tray.setMenu(menu);

        // Monitor status updates
        await listenToMonitorStatusUpdate((running) => {
          monitorItem?.setText(running ? "Stop Monitor" : "Start Monitor");
          tray?.setTooltip(running ? "Monitoring is on" : "Monitoring is off");
        });
      } catch (err) {
        console.error("Tray Setup Error:", err);
      }
    };

    setupTray();
  }, []);

  // -----------------------------------------------------
  // 🔥 Update menu item text when clipboard changes
  // -----------------------------------------------------
  useEffect(() => {
    if (!recentItem || !previousItem) return;

    if (mostRecentItems[0]) {
      // recentItem.setText(mostRecentItems[0].content.slice(0, 20));
    }

    if (mostRecentItems[1]) {
      // previousItem.setText(mostRecentItems[1].content.slice(0, 20));
    }
  }, [mostRecentItems]);

  return null;
};

export default TrayMenuHandler;
