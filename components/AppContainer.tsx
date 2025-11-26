"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Toaster } from "@/components/ui/sonner";
import WelcomeScreen from "@/components/screens/WelcomeScreen";
import SetupScreen from "@/components/screens/SetupScreen";
import LockScreen from "@/components/screens/LockScreen";
export default function AppContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { screen, initApp, initialized, handleWindowFocus, handleWindowBlur } =
    useAppStore();

  useEffect(() => {
    initApp();

    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  if (!initialized) return null;

  switch (screen) {
    case "welcome":
      return <WelcomeScreen />;
    case "setup":
      return <SetupScreen />;
    case "lock":
      return <LockScreen />;
    case "clipboard":
      return (
        <>
          <Toaster />
          {children}
        </>
      );
    default:
      return null;
  }
}
