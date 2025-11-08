import { AppSidebar } from "@/components/AppSidebar";
import Clipboards from "@/components/Clipboards";
import Navbar from "@/components/Navbar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Navbar />
        <div className="flex flex-1 flex-col relative">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Link href={'/setup'}>setup</Link>
              <Clipboards />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
