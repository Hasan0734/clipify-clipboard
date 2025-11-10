"use client";
import React, { useEffect } from "react";
import ClipboardCard from "./ClipboardCard";
import { Button } from "./ui/button";
import { Calendar, Clipboard, SortAsc } from "lucide-react";
import SearchBar from "./SearchBar";
import { isMonitorRunning } from "tauri-plugin-clipboard-api";

import { AlertDialog, AlertDialogTrigger } from "./ui/alert-dialog";
import ClearAlert from "./ClearAlert";

import { useClipboardStore } from "@/store/useClipboardStore";
import { useFocusedPasteListener } from "@/hooks/useFocusedPasteListener";

const Clipboards = () => {
  const { items, fetchItems } = useClipboardStore((st) => st);
  useFocusedPasteListener();

  async function handlePaste() {
    console.log(await isMonitorRunning());
  }

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-center  mb-10">
        {/* <h2 className="">{clipboards.length} items</h2> */}

        <div className="space-x-2 flex ">
          <SearchBar />
          <Button onClick={handlePaste} variant={"outline"}>
            Sort by <SortAsc />
          </Button>
          <Button variant={"outline"}>
            By Date <Calendar />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"outline"}>Clear All</Button>
            </AlertDialogTrigger>
            <ClearAlert />
          </AlertDialog>
        </div>
      </div>

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-liner-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 @7xl/main:grid-cols-4">
        {items.length > 0 ? (
          items
            .reverse()
            .map((item) => <ClipboardCard key={item.id} data={item} />)
        ) : (
          <div className="flex items-center flex-col gap-6 col-span-full row-span-16 text-center justify-center">
            <Clipboard size={50} />
            <div>No clipboard data. Enable monitoring to auto-save.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clipboards;
