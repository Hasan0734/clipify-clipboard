import { getDB } from "@/lib/db";
import { create } from "zustand";
import bcrypt from "bcryptjs";
import { persist } from "zustand/middleware";

type Screen = "welcome" | "setup" | "lock" | "clipboard";

type AppStore = {
  screen: Screen;
  initialized: boolean;
  pinExists: boolean;

  setScreen: (s: Screen) => void;
  initApp: () => Promise<void>;
  savePin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  resetApp: () => Promise<void>;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      screen: "welcome",
      setScreen: (screen) => set({ screen }),
      pinExists: false,
      initialized: false,

      initApp: async () => {
        try {
          const db = await getDB();
          const row = await db.select(
            "SELECT value FROM settings WHERE key='has_setup'"
          );

          if (!row?.[0])
            set({ screen: "welcome", pinExists: false, initialized: true });
          else set({ screen: "lock", pinExists: true, initialized: true });
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
        set({ screen: "clipboard", pinExists: true });
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
    set({ screen: "welcome", pinExists: false, initialized: true });
      },
    }),
    {
      name: "clipboard-app",
      partialize: (state) => ({
        pinExists: state.pinExists,
      }),
    }
  )
);
