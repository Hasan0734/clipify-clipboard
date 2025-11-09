"use client";
import ClipboardApp from "@/components/screens/ClipboardApp";
import LockScreen from "@/components/screens/LockScreen";
import SetupScreen from "@/components/screens/SetupScreen";
import WelcomeScreen from "@/components/screens/WelcomeScreen";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";

export default function Home() {
  const { screen, initApp, pinExists, initialized } = useAppStore();


  console.log({screen, pinExists})
  // useEffect(() => {

  // },[])

  useEffect(() => {
    initApp();
  }, [initApp]);

  if(!initialized){
    return null;
  }

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

  // return <WelcomeScreen/>
}
