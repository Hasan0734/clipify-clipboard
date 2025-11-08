"use client";
import { Clipboard, PauseCircle, PlayCircle, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { useClipboardStore } from "@/store/clipboard-store";
import { NewClipDialog } from "./NewClip";
import { toast } from "sonner";
import { useClipboardStore2 } from "@/store/useClipboardStore";
import { clear, isMonitorRunning, startListening, stopMonitor } from "tauri-plugin-clipboard-api";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const { handleAddNew } = useClipboardStore((state) => state);

  const addItem = useClipboardStore2((st) => st.addItem);

  useEffect(() => {
    const monitor = async () => {
      const isMn = await isMonitorRunning();
      setIsMonitoring(isMn);
      console.log({isMn})
    };

    monitor();
  }, [isMonitoring]);

  const handleMonitor = async () => {
    const isMn = await isMonitorRunning(); 
    if (!isMn) {
      await clear();
      await startListening();
      return;
    }
    await clear();
    await stopMonitor()

  };

  const handleCreateClip = (data: {
    content: string;
    type: "text" | "image" | "link";
    isFavorite: boolean;
  }) => {
    const newClip = {
      content: data.content,
      type: data.type,
      isFavorite: data.isFavorite,
    };
    // handleAddNew(newClip);
    addItem(newClip);
    toast("Clip created!", {
      description: "Your new clip has been added successfully.",
    });
  };

  return (
    <>
      <header className="flex  py-2 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Smart Clipboard Manager</h1>

          <div className="ml-auto flex items-center gap-2">
            <Button
              onClick={handleMonitor}
              variant={isMonitoring ? "default" : "outline"}
              className="gap-2"
            >
              {isMonitoring ? (
                <>
                  <PauseCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Monitoring</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Monitor Clipboard</span>
                </>
              )}
            </Button>
            <Button
              onClick={() => setOpen(!open)}
              variant="default"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Clip</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <NewClipDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreateClip}
      />
    </>
  );
};

export default Navbar;
