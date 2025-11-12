import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../AppSidebar";
import Navbar from "../Navbar";
import Clipboards from "../Clipboards";
import React, { useEffect } from "react";
import { Calendar, Clipboard, SortAsc } from "lucide-react";
import SearchBar from "../SearchBar";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import ClearAlert from "../ClearAlert";
import { isMonitorRunning } from "tauri-plugin-clipboard-api";

const ClipboardApp = () => {
  async function handlePaste() {
    console.log(await isMonitorRunning());
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="space-y-5 sticky top-0 z-10 bg-background pb-5">
          <Navbar />

          <div className=" z-10 flex items-center justify-center">
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
        </div>
        <div className="flex flex-1 flex-col relative">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Clipboards />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ClipboardApp;
