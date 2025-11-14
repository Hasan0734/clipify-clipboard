import { ChartAreaInteractive } from "@/components/analytics/ChartArea";
import Statics from "@/components/analytics/Statics";
import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const AnalyticsPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <Navbar />
        <div className="flex flex-1 flex-col relative">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <Statics />
             <ChartAreaInteractive />
             
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AnalyticsPage;
