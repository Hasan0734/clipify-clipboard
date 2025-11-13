import { ClipboardItem } from "@/lib/types";
import { create } from "zustand";
import { toast } from "sonner";
import { getDB } from "@/lib/db";
import { nanoid } from "nanoid";
import { isLink } from "@/lib/utils";

type ClipboardStore = {
  items: ClipboardItem[];
  filterType: string;
  searchQuery: string;
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
  handleSorting: (isDesc: boolean) => Promise<void>;
  handleFilterByDate: (date: Date | undefined) => Promise<void>;
};

export const useClipboardStore = create<ClipboardStore>((set, get) => ({
  items: [],
  filterType: "all",
  searchQuery: "",
  filterDate: undefined,
  findCountedItems: async () => {
    const db = await getDB();
    const count = await db.select(`SELECT COUNT(*) FROM clipboards LIMIT 1`);

    console.log({ count });
  },
  fetchItems: async () => {
    const db = await getDB();
    const rows = await db.select(
      "SELECT * FROM clipboards ORDER BY createdAt DESC"
    );

    //  ORDER BY created DESC

    set({ items: rows });
  },
  applyFilters: async () => {
    const {  filterType, searchQuery, fetchItems, filterDate } = get();
    const db = await getDB();

    let query = "SELECT * FROM clipboards WHERE 1=1";
    const params: any[] = [];

    if (filterType && filterType !== "all" && filterType !== "favorite") {
      query += " AND type = ?";
      params.push(filterType);
    }
    if (filterType === "favorite") {
      query += " AND isFavorite = 1";
    }

    if(filterDate) {
      const timestamps = filterDate.getTime();

      query += ` AND createdAt >= ${timestamps} AND createdAt < ${timestamps + 86400000}`

    }

    if (searchQuery) {
      query += " AND content LIKE ?";
      params.push(`%${searchQuery}%`);
    }

    query += " ORDER BY createdAt DESC";

    const rows = await db.select(query, params);

    set({ items: rows });
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
  },
  deleteItem: async (id) => {
    try {
      const db = await getDB();
      const { fetchItems } = get();
      await db.execute("DELETE FROM clipboards WHERE id = ?", [id]);
      await fetchItems();
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

    await get().fetchItems();
  },
  clearAll: async () => {
    const db = await getDB();
    await db.execute("DELETE FROM clipboards");
    set(() => ({ items: [] }));
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

  handleSorting: async (isDesc) => {
    const db = await getDB();
    let query = "SELECT * FROM clipboards ORDER BY createdAt ";
    if (isDesc) {
      query += "DESC";
    } else {
      query += "ASC";
    }
    const rows = await db.select(query);

    set({ items: rows });
  },
  handleFilterByDate: async (date) => {
    set({ filterDate: date });
    get().applyFilters();
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
