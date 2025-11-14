import React, { useEffect } from "react";
import ClipboardHeader from "./ClipboardHeader";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Clipboards from "./Clipboards";
import WelcomeScreen from "./screens/WelcomeScreen";
import SetupScreen from "./screens/SetupScreen";
import LockScreen from "./screens/LockScreen";
import { useAppStore } from "@/store/useAppStore";

const CustomLayout = ({ children }: { children: React.ReactNode }) => {
  const { screen, initApp, initialized, handleWindowFocus, handleWindowBlur } =
    useAppStore();

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default CustomLayout;
