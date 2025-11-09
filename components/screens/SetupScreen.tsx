"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export default function SetupScreen() {
  const { savePin } = useAppStore();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (pin.length < 4) return setError("PIN must be at least 4 digits");
    if (pin !== confirmPin) return setError("PINs do not match");
    savePin(pin);
  };

  return (
    <motion.div
      className="h-screen flex flex-col items-center justify-center space-y-4 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold">Set Your PIN</h2>
      <p className="text-gray-500 text-sm">This will lock your clipboard for privacy.</p>

      <Input
        type="password"
        placeholder="Enter PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="w-64 text-center"
      />
      <Input
        type="password"
        placeholder="Confirm PIN"
        value={confirmPin}
        onChange={(e) => setConfirmPin(e.target.value)}
        className="w-64 text-center"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button onClick={handleSubmit} className="w-64">
        Save & Continue
      </Button>
    </motion.div>
  );
}
