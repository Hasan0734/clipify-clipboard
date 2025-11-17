import { ClipboardItem } from "@/lib/types";
import { create } from "zustand";
import { toast } from "sonner";
import { getDB } from "@/lib/db";
import { nanoid } from "nanoid";
import { isLink } from "@/lib/utils";

type COUNT = {
  total: number;
  totalLink: number;
  totalText: number;
  totalFavorite: number;
};

type ClipboardStore = {
  items: ClipboardItem[];
  filterType: string;
  searchQuery: string;
  sortByDesc: boolean;
  filterDate: Date | undefined;
  fetchItems: () => Promise<void>;
  addItem: (dat: Partial<ClipboardItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  handleFilter: (type: string) => void;
  handleSearch: (query: string) => void;
  applyFilters: () => void;
  findCountedItems: () => Promise<void>;
  handleSorting: () => Promise<void>;
  handleFilterByDate: (date: Date | undefined) => Promise<void>;
  count: COUNT | undefined;
};

export const useClipboardStore = create<ClipboardStore>((set, get) => ({
  items: [],
  filterType: "all",
  searchQuery: "",
  sortByDesc: true,
  filterDate: undefined,
  count: { total: 0, totalLink: 0, totalText: 0, totalFavorite: 0 },
  findCountedItems: async () => {
    const db = await getDB();
    const count = await db.select(
      `SELECT COUNT(*) as total, 
      COUNT(CASE WHEN type = 'text' THEN 1 END) AS totalText,
      COUNT(CASE WHEN type = 'link' THEN 1 END) AS totalLink,
      COUNT(CASE WHEN isFavorite = 1 THEN 1 END) AS totalFavorite
      FROM clipboards`
    );

    set({ count: count[0] });
  },
  fetchItems: async () => {
    get().applyFilters();
  },
  applyFilters: async () => {
    const { filterType, searchQuery, sortByDesc, filterDate } = get();
    const db = await getDB();

    let query = "SELECT * FROM clipboards";
    const params: any[] = [];
    let whereAdded = false; // Flag to track if WHERE clause has been added

    // Helper function to correctly add WHERE or AND
    const addCondition = (condition: string) => {
      if (!whereAdded) {
        query += " WHERE";
        whereAdded = true;
      }
      query += " " + condition;
    };

    if (filterType && filterType !== "all" && filterType !== "favorite") {
      addCondition("type = ?");
      params.push(filterType);
    }
    if (filterType === "favorite") {
      addCondition("isFavorite = 1");
    }

    if (filterDate) {
      const timestamps = filterDate.getTime();
      addCondition(
        `createdAt >= ${timestamps} AND createdAt < ${timestamps + 86400000}`
      );
    }

    if (searchQuery) {
      addCondition(` AND "content" LIKE ?`);
      params.push(`%${searchQuery}%`);
    }

    if (sortByDesc) {
      query += " ORDER BY createdAt DESC";
    } else {
      query += " ORDER BY createdAt ASC";
    }

    const rows = await db.select(query, params);

    set({ items: rows });
    await get().findCountedItems();
  },
  addItem: async (data) => {
    try {
      const db = await getDB();

      const id = nanoid();
      const createdAt = Date.now();
      const isFavorite = data.isFavorite ? 1 : 0;

      if (data.content && isLink(data.content)) {
        data.type = "link";
      }

      await db.execute(
        "INSERT INTO clipboards (id, content, type, isFavorite, createdAt) VALUES (?, ?, ?, ?, ?)",
        [id, data.content, data.type ?? "text", isFavorite, createdAt]
      );
      toast("Clip created!", {
        description: "Your new clip has been added successfully.",
      });
    } catch (error) {
      toast.error("Clipboard is accept duplicate text.");
    }
    await get().applyFilters();
    await get().findCountedItems();
  },
  deleteItem: async (id) => {
    try {
      const db = await getDB();

      await db.execute("DELETE FROM clipboards WHERE id = ?", [id]);
      await get().applyFilters();
      await get().findCountedItems();
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error("Delete item not found.");
    }
  },
  toggleFavorite: async (id) => {
    const db = await getDB();
    await db.execute(
      "UPDATE clipboards SET isFavorite = CASE WHEN isFavorite=1 THEN 0 ELSE 1 END WHERE id = ?",
      [id]
    );

    await get().applyFilters();
    await get().findCountedItems();
  },
  clearAll: async () => {
    const db = await getDB();
    await db.execute("DELETE FROM clipboards");
    set(() => ({ items: [] }));
    await get().findCountedItems();
    toast("Cleared all of clipboard data.");
  },
  handleFilter: (type) => {
    set({ filterType: type });
    get().applyFilters();
  },

  handleSearch: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  handleSorting: async () => {
    console.log({ sort: get().sortByDesc });
    set((state) => ({ sortByDesc: !state.sortByDesc }));
    get().applyFilters();
  },
  handleFilterByDate: async (date) => {
    set({ filterDate: date });
    get().applyFilters();
    await get().findCountedItems();
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
