import { AppSidebar } from "@/components/AppSidebar";
import ClipboardList from "@/components/ClipboardList";
import Navbar from "@/components/Navbar";
import Header from "@/components/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
         <Navbar />
      </main>
    </SidebarProvider>
  );
}
