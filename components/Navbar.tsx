"use client";
import { Lock, PauseCircle, PlayCircle, Plus } from "lucide-react";
import {useState } from "react";
import { Button } from "./ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { NewClipDialog } from "./NewClip";
import { useClipboardStore } from "@/store/useClipboardStore";
import { useAppStore } from "@/store/useAppStore";
import { useMonitor } from "@/hooks/use-monitor";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const addItem = useClipboardStore((st) => st.addItem);
  const { isRunning, handleStartListen, handleStopListen } = useMonitor();
  const { setScreen } = useAppStore();
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
    addItem(newClip);
  
  };

  return (
    <>
      <header className="bg-background rounded-t-xl flex  py-2 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Smart Clipboard Manager</h1>

          <div className="ml-auto flex items-center gap-2">
            <Button
            size={'sm'}
              onClick={() => {
                isRunning ? handleStopListen() : handleStartListen();
              }}
              variant={isRunning ? "default" : "outline"}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <PauseCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Monitoring</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Monitor</span>
                </>
              )}
            </Button>
            <Button
            size={'sm'}
              onClick={() => setOpen(!open)}
              variant="default"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Clip</span>
            </Button>
            <ThemeToggle />
            <Button variant={"ghost"} onClick={() => setScreen("lock")} size={"icon-sm"}>
              <Lock />
            </Button>
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
