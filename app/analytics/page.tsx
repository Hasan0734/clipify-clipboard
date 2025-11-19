"use client";

import { ChartAreaInteractive } from "@/components/analytics/ChartArea";
import Statics from "@/components/analytics/Statics";
import TypeDistribution from "@/components/analytics/TypeDistribution";
import WeeklyActivity from "@/components/analytics/WeeklyActivity";
import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAnalytics } from "@/store/useAnalytics";
import React, { useEffect } from "react";

const AnalyticsPage = () => {
  const { getAnalytics } = useAnalytics();

  useEffect(() => {
    getAnalytics();
  }, []);

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

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                <WeeklyActivity />
                <TypeDistribution/>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AnalyticsPage;
