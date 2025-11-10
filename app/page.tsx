"use client";
import ClipboardApp from "@/components/screens/ClipboardApp";
import LockScreen from "@/components/screens/LockScreen";
import SetupScreen from "@/components/screens/SetupScreen";
import WelcomeScreen from "@/components/screens/WelcomeScreen";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";

export default function Home() {
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
  }, [initApp, handleWindowFocus, handleWindowBlur]);

  if (!initialized) {
    // Return loading state or null while app state is being determined
    return null; 
  }

  // 3. Use a switch statement for clean screen rendering
  switch (screen) {
    case "welcome":
      return <WelcomeScreen />;
    case "setup":
      return <SetupScreen />;
    case "lock":
      return <LockScreen />;
    case "clipboard":
      return <ClipboardApp />;
    default:
      return null;
  }
}