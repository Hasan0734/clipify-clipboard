"use client";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/appStore";
import { motion } from "framer-motion";

export default function WelcomeScreen() {
  const { setScreen } = useAppStore();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-blue-50 to-white">
      <motion.h1
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Welcome to Clipify ✨
      </motion.h1>
      <p className="text-gray-600 max-w-sm mb-8">
        Your smart clipboard manager. Save, search, and organize everything you copy — automatically.
      </p>
      <Button onClick={() => setScreen("setup")}>Get Started</Button>
    </div>
  );
}
