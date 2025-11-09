"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export default function LockScreen() {
  const { verifyPin } = useAppStore();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

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
      <h2 className="text-2xl font-semibold">Enter PIN to Unlock 🔐</h2>
      <Input
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="w-64 text-center"
        placeholder="Enter your PIN"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button onClick={handleUnlock} className="w-64">
        Unlock
      </Button>
    </motion.div>
  );
}
