"use client"
import React, { useState } from "react";
import Navbar from "./Navbar";
import { ChevronDownIcon, SortAsc, SortDesc, Trash, X } from "lucide-react";
import { useClipboardStore } from "@/store/useClipboardStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SearchBar from "./SearchBar";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Calendar } from "./ui/calendar";
import { AlertDialog, AlertDialogTrigger } from "./ui/alert-dialog";
import ClearAlert from "./ClearAlert";

const ClipboardHeader = () => {
  const { handleSorting, items, handleFilterByDate, filterDate, sortByDesc } =
    useClipboardStore();
  const [open, setOpen] = useState(false);
  // const [date, setDate] = useState<Date | undefined>(undefined);

  const oldest = items.reduce((oldest, item) => {
    return new Date(item.createdAt) < new Date(oldest.createdAt)
      ? item
      : oldest;
  }, items[0]);

  const handleSort = () => {
    handleSorting();
  };

  const handleDate = (date: Date | undefined) => {
    if (!date) return;
    setOpen(false);
    handleFilterByDate(date);
  };
  return (
    <div className="space-y-5 sticky top-0 z-10 bg-background pb-5 rounded-t-xl">
      <Navbar />

      <div className=" z-10 flex items-center justify-center">
        {/* <h2 className="">{clipboards.length} items</h2> */}

        <div className="space-x-2 flex ">
          <SearchBar />
          <Button size={"sm"} onClick={handleSort} variant={"outline"}>
            Sort by {sortByDesc ? <SortDesc /> : <SortAsc />}
          </Button>
          <ButtonGroup>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  size={"sm"}
                  variant="outline"
                  id="date"
                  className="w-32 justify-between font-normal"
                >
                  {filterDate ? filterDate.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={filterDate}
                  captionLayout="dropdown"
                  disabled={{
                    after: new Date(),
                  }}
                  onSelect={handleDate}
                />
              </PopoverContent>
            </Popover>
            {filterDate && (
              <Button
                variant={"outline"}
                onClick={() => handleFilterByDate(undefined)}
                size={"icon-sm"}
                className=""
              >
                <X />
              </Button>
            )}
          </ButtonGroup>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size={"sm"} variant={"outline"}>
                <Trash /> Clear All
              </Button>
            </AlertDialogTrigger>
            <ClearAlert />
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ClipboardHeader;
