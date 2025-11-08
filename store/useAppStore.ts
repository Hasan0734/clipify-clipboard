import { getDB } from "@/lib/db";
import { create } from "zustand";

type Screen = "welcome" | "setup" | "lock" | "clipboard";

type AppStore = {
  screen: Screen;
  setScreen: (s: Screen) => void;
  initApp: () => Promise<void>;
  savePin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
};

export const useAppStore = create<AppStore>((set) => ({
  screen: "welcome",
  setScreen: (screen) => set({ screen }),
  initApp: async () => {
    const db = await getDB();
    const row = await db.select(
      "SELECT value FROM settings WHERE key='has_setup'"
    );
    if (!row?.[0]) set({ screen: "welcome" });
    else set({ screen: "lock" });
  },
  savePin: async (pin: string) => {
    const db = await getDB();
    const hashed = hash(pin);

    await db.execute(
      "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
      ["pin_hash", hashed]
    );
    await db.execute(
      "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
      ["has_setup", "true"]
    );
    set({ screen: "clipboard" });
  },
  verifyPin: async (pin: string) => {
    const db = await getDB();
    const row = await db.select(
      "SELECT value FROM settings WHERE key='pin_hash'"
    );
    const isValid = compare(pin, row?.[0]?.value);
    if (isValid) set({ screen: "clipboard" });

    return isValid;
  },
}));
