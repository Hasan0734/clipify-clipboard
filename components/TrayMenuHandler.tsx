"use client";

import { useEffect, useRef } from "react";
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

import { UnlistenFn } from "@tauri-apps/api/event";
import { useClipboardStore } from "@/store/useClipboardStore";

const TrayMenuHandler = () => {
  const { mostRecentItems } = useClipboardStore((st) => st);

  console.log(mostRecentItems);

  const trayRef = useRef<TrayIcon | undefined>(undefined);

  useEffect(() => {
    let statusUnlisten: UnlistenFn | undefined;

    const setupTray = async () => {
      // Check if a tray already exists in the ref
      if (trayRef.current) return;

      try {
        const options = {
          id: "main-tray", // Consistent ID ensures OS handles single instance
          tooltip: "Smart Clipboard Manager",
          menuOnLeftClick: true,
        };

        const newTray = await TrayIcon.new(options);
        trayRef.current = newTray; // Store the new tray instance in the ref
        await newTray.setIcon(await defaultWindowIcon());

        const seperate = await PredefinedMenuItem.new({ item: "Separator" });
        // Create the menu recent copied

        const recentItem = await MenuItem.new({
          id: "recent_clip",
          text: "Recent Clip",
          action: async () => {
            await writeText(mostRecentItems[0].content);
          },
        });

        const previousOne = await MenuItem.new({
          id: "previous",
          text: "Previous Clip",
          action: async () => {
            await writeText(mostRecentItems[1].content);
          },
        });

        // const copiedItemPromises = mostRecentItems.map(async (clip) => {
        //   const item = await MenuItem.new({
        //     id: clip.id,
        //     text: clip.content.slice(0, 20),
        //     action: async () => {
        //       await writeText(clip.content);
        //     },
        //   });

        //   return item;
        // });

        // const copiedItems = await Promise.all(copiedItemPromises);
        // Create the menu action items
        const monitorMenuItem = await MenuItem.new({
          id: "toggle_monitor",
          text: "Start Monitor",
          action: async () => {
            const checkRunning = await isMonitorRunning();
            if (checkRunning) {
              await stopMonitor();
            } else {
              await startListening();
            }
          },
        });
        const quitMenuItem = await MenuItem.new({
          id: "quit",
          text: "Quit",
          action: async () => {
            const window = await getCurrentWindow();
            if (trayRef.current) {
              await trayRef.current.close();
              trayRef.current = undefined;
            }
            window.destroy();
          },
        });

        const reOpenItem = await MenuItem.new({
          id: "reopen",
          text: "Open",
          action: async () => {
            const window = await getCurrentWindow();
            // if (trayRef.current) {
            //   await trayRef.current.close(); // Close the tray explicitly
            //   trayRef.current = undefined;
            // }
            window.show();
            window.setFocus();
          },
        });

        const menu = await Menu.new({
          items: [
            recentItem,
            previousOne,
            seperate,
            monitorMenuItem,
            reOpenItem,
            quitMenuItem,
          ],
        });

        await newTray.setMenu(menu);

        // Listen to monitor status updates and update the menu item text in real time
        statusUnlisten = await listenToMonitorStatusUpdate((running) => {
          monitorMenuItem.setText(running ? "Stop Monitor" : "Start Monitor");
          newTray.setTooltip(
            running ? "Monitoring is on" : "Monitoring is off"
          );
        });
      } catch (e) {
        console.error("Could not set up tray menu handlers", e);
      }
    };

    setupTray();

    // The cleanup function for useEffect
    return () => {
      if (statusUnlisten) {
        statusUnlisten(); // Clean up the listener
      }
      // CRITICAL: Close the tray icon on component unmount
      if (trayRef.current) {
        // We can safely close it here when the React component instance is being destroyed.
        trayRef.current.close();
        trayRef.current = undefined;
      }
    };
  }, []); // Empty dependency array ensures this runs once per component mount/unmount cycle

  return null;
};

export default TrayMenuHandler;
