"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { useMonitor } from "@/hooks/use-monitor";
import { Lock } from "lucide-react";

export default function LockScreen() {
  const { verifyPin } = useAppStore();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useMonitor();

  const handleUnlock = async () => {
    const ok = await verifyPin(pin);
    if (!ok) setError("Incorrect PIN");
  };

  return (
    <motion.div
      className="h-screen flex flex-col items-center justify-center space-y-4 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
          <Lock className="w-16 h-16 text-primary-foreground" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Clipify System</h2>
          <p className="text-muted-foreground mt-2">Enter password to unlock</p>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUnlock();
        }}
        className="flex flex-col space-y-4"
      >
        <Input
          type="password"
          autoFocus
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-64 text-center"
          placeholder="Enter your PIN"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-64">Unlock</Button>
      </form>
      <div className="text-center text-sm text-muted-foreground">
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </motion.div>
  );
}
