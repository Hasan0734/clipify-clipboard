"use client";
import { useEffect, useState } from "react";
import {
    startListening,
    stopMonitor,
    onClipboardUpdate,
    onTextUpdate,
    listenToMonitorStatusUpdate,
    isMonitorRunning,
    hasText,
} from "tauri-plugin-clipboard-api";

export default function ClipboardListener() {
    const [monitorRunning, setMonitorRunning] = useState(false);
    const [text, setText] = useState("");
    const [hasClipboardText, setHasClipboardText] = useState(false);

    useEffect(() => {
        let unlistenText: (() => void) | null = null;
        let unlistenMonitor: (() => void) | null = null;

        const init = async () => {
            const running = await isMonitorRunning();
            setMonitorRunning(running);

            // Always listen for monitor status changes
            unlistenMonitor = await listenToMonitorStatusUpdate((running) => {
                setMonitorRunning(running);
            });

            if (running) await startMonitoring();
        };

        const startMonitoring = async () => {
            // Start listening to system clipboard events
            await startListening();

            // Listen for actual text updates
            unlistenText = await onTextUpdate((val) => {
                if (val.trim() !== "") setText(val);
            });
        };

        init();

        return () => {
            if (unlistenText) unlistenText();
            if (unlistenMonitor) unlistenMonitor();
        };
    }, []);


    useEffect(() => {
        
    }, [])

    const toggleMonitor = async () => {
        if (monitorRunning) {
            await stopMonitor();
            setMonitorRunning(false);
        } else {
            await startListening();
            setMonitorRunning(true);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div>
                <strong>Monitor running:</strong>{" "}
                {monitorRunning ? "✅ Yes" : "❌ No"}
            </div>

            <button
                className="px-3 py-1 rounded bg-blue-600 text-white"
                onClick={toggleMonitor}
            >
                {monitorRunning ? "Stop Listening" : "Start Listening"}
            </button>

            <div className="space-y-2">
                <div>
                    <strong>Has Text:</strong> {String(hasClipboardText)}
                </div>
            </div>

            {text && (
                <div>
                    <h3 className="font-semibold">Clipboard Text</h3>
                    <pre className="border p-2 rounded whitespace-pre-wrap break-words">
            {text}
          </pre>
                </div>
            )}
        </div>
    );
}
