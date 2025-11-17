import { getDB } from "@/lib/db";
import { create } from "zustand";
import bcrypt from "bcryptjs";
import { persist } from "zustand/middleware";

type Screen = "welcome" | "setup" | "lock" | "clipboard";

type AppStore = {
  screen: Screen;
  initialized: boolean;

  setScreen: (s: Screen) => void;
  initApp: () => Promise<void>;
  savePin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  resetApp: () => Promise<void>;
  handleWindowFocus: () => void;
  handleWindowBlur: () => void;
  activeCopiedText: string;
  setActiveCopiedText: (text: string) => void;
};

let lockTimeout: NodeJS.Timeout | null = null;

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      screen: "welcome",
      setScreen: (screen) => set({ screen }),
      initialized: false,

      activeCopiedText: "",

      setActiveCopiedText: (text: string) => set({ activeCopiedText: text }),

      initApp: async () => {
        try {
          const db = await getDB();
          const row = await db.select(
            "SELECT value FROM settings WHERE key='has_setup'"
          );

          if (!row?.[0]) set({ screen: "welcome", initialized: true });
          else set({ screen: "lock", initialized: true });
        } catch (error) {
          console.error("initApp error:", error);
          set({ screen: "setup", initialized: true });
        }
      },

      savePin: async (pin: string) => {
        const db = await getDB();
        const hashed = await bcrypt.hashSync(pin, 10);

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
        const isValid = bcrypt.compareSync(pin, row?.[0]?.value);
        if (isValid) set({ screen: "clipboard" });

        return isValid;
      },

      resetApp: async () => {
        const db = await getDB();
        await db.execute("DELETE FROM clipboards");
        await db.execute("DELETE FROM settings");
        set({ screen: "welcome", initialized: true });
        
        if (lockTimeout) clearTimeout(lockTimeout);
      },
      handleWindowFocus: () => {
        if (lockTimeout) {
          clearTimeout(lockTimeout);
          lockTimeout = null;
        }
      },

      handleWindowBlur: () => {
        if (lockTimeout) clearTimeout(lockTimeout);
        lockTimeout = setTimeout(() => {
          const { screen, initialized, setScreen } = get();
          if (screen === "clipboard" && initialized) {
            setScreen("lock");
          }
        }, 1 * 60 * 5000); // 1 minutes
      },
    }),
    {
      name: "clipboard-app",
    }
  )
);
