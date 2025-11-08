import { ClipboardItem, ClipboardType } from "@/lib/types";
import { create } from "zustand";
import { generateShortId, isLink } from "@/lib/utils";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import {
  startListening,
  stopMonitor,
  clear,
  startMonitor,
} from "tauri-plugin-clipboard-api";
import { getDB } from "@/lib/db";
import { nanoid } from "nanoid";

type ClipboardStore = {
  items: ClipboardItem[];
  fetchItems: () => Promise<void>;
  addItem: (dat: Partial<ClipboardItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
};

export const useClipboardStore2 = create<ClipboardStore>((set, get) => ({
  items: [],
  fetchItems: async () => {
    const db = await getDB();
    const rows = await db.select("SELECT * FROM clipboards");

    //  ORDER BY created DESC

    set({ items: rows });
  },
  addItem: async (data) => {
    const db = await getDB();

    const id = nanoid();
    const createdAt = Date.now();
    const isFavorite = data.isFavorite ? 1 : 0;

    await db.execute(
      "INSERT INTO clipboards (id, content, type, isFavorite, createdAt) VALUES (?, ?, ?, ?, ?)",
      [id, data.content, data.type ?? "text", isFavorite, createdAt]
    );

    await get().fetchItems();
  },
  deleteItem: async (id) => {
    const db = await getDB();
    const { fetchItems } = get();
    await db.execute("DELETE FROM clipboards WHERE id = ?", [id]);
    fetchItems();
  },
  toggleFavorite: async (id) => {
    const db = await getDB();
    await db.execute(
      "UPDATE clipboards SET isFavorite = CASE WHEN isFavorite=1 THEN 0 ELSE 1 END WHERE id = ?",
      [id]
    );

    await get().fetchItems();
  },
  clearAll: async () => {
    const db = await getDB();
    await db.execute("DELETE FROM clipboards");
    set(() => ({ items: [] }));
    toast("Cleared all of clipboard data.");
  },
}));



// {
//         "title": "Clipboard Manager",
//         "width": 1200,
//         "height": 800,
//         "resizable": true,
//         "fullscreen": false,
//         "decorations": false
//       }