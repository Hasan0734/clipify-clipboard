import React from "react";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import TrayMenuHandler from "./TrayMenuHandler";

const CustomLayout = ({ children }: { children: React.ReactNode }) => {


  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <TrayMenuHandler/>
        {children}</SidebarInset>
    </SidebarProvider>
  );
};

export default CustomLayout;
