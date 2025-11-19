"use client";
import React, { useEffect } from "react";
import ClipboardCard from "./ClipboardCard";
import {  Clipboard } from "lucide-react";
import { useClipboardStore } from "@/store/useClipboardStore";

const Clipboards = () => {
  const { items, fetchItems } = useClipboardStore((st) => st);

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="px-4 lg:px-6">
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-liner-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 @7xl/main:grid-cols-4">
        {items.length > 0 ? (
          items.map((item) => <ClipboardCard key={item.id} data={item} />)
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
