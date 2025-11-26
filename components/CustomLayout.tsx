import React from "react";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";


const CustomLayout = ({ children }: { children: React.ReactNode }) => {


  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        {children}</SidebarInset>
    </SidebarProvider>
  );
};

export default CustomLayout;
