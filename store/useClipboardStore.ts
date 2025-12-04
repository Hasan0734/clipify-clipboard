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
  mostRecentItems: ClipboardItem[];

  filterType: string;
  searchQuery: string;
  sortByDesc: boolean;
  filterDate: Date | undefined;

  limit: number;
  offset: number;
  hasMore: boolean;

  resetPagination: () => void;

  fetchItems: (isLoadMore?: boolean) => Promise<void>;
  applyFilters: (isLoadMore?: boolean) => Promise<void>;

  addItem: (dat: Partial<ClipboardItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;

  handleFilter: (type: string) => void;
  handleSearch: (query: string) => void;
  handleSorting: () => Promise<void>;
  handleFilterByDate: (date: Date | undefined) => Promise<void>;

  getMostRecentItems: () => Promise<void>;
  findCountedItems: () => Promise<void>;

  count: COUNT | undefined;
};

export const useClipboardStore = create<ClipboardStore>((set, get) => ({
  items: [],
  mostRecentItems: [],

  filterType: "all",
  searchQuery: "",
  sortByDesc: true,
  filterDate: undefined,

  limit: 50,
  offset: 0,
  hasMore: true,

  count: { total: 0, totalLink: 0, totalText: 0, totalFavorite: 0 },

  // RESET pagination when filters change
  resetPagination: () => set({ offset: 0, hasMore: true, items: [] }),

  // MAIN LOAD FUNCTION
  fetchItems: async (isLoadMore = false) => {
    await get().applyFilters(isLoadMore);
    await get().getMostRecentItems();
  },

  // FULL FILTERING + PAGINATION
  applyFilters: async (isLoadMore = false) => {
    const { filterType, searchQuery, sortByDesc, filterDate, limit } = get();
    let { offset, items } = get();

    const db = await getDB();

    let query = "SELECT * FROM clipboards";
    const params: any[] = [];
    const where = [];

    // Type filter
    if (filterType && filterType !== "all" && filterType !== "favorite") {
      where.push("type = ?");
      params.push(filterType);
    }

    // Favorite filter
    if (filterType === "favorite") {
      where.push("isFavorite = 1");
    }

    // Date filter
    if (filterDate) {
      const ts = filterDate.getTime();
      where.push("createdAt >= ? AND createdAt < ?");
      params.push(ts, ts + 86400000);
    }

    // Search filter
    if (searchQuery) {
      where.push("content LIKE ?");
      params.push(`%${searchQuery}%`);
    }

    // WHERE clause
    if (where.length > 0) {
      query += " WHERE " + where.join(" AND ");
    }

    // Sorting
    query += ` ORDER BY createdAt ${sortByDesc ? "DESC" : "ASC"}`;

    // Pagination
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Execute
    const rows = await db.select(query, params);

    // Append or reset items
    if (isLoadMore) {
      items = [...items, ...rows];
    } else {
      items = rows;
    }

    set({
      items,
      offset: offset + limit,
      hasMore: rows.length === limit,
    });

    await get().findCountedItems();
  },

  // ADD ITEM
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

      toast("Clip created!");

      get().resetPagination();
      await get().fetchItems();
    } catch (error) {
      toast.error("Clipboard does not accept duplicate text.");
    }
  },

  // DELETE ITEM
  deleteItem: async (id) => {
    try {
      const db = await getDB();
      await db.execute("DELETE FROM clipboards WHERE id = ?", [id]);

      get().resetPagination();
      await get().fetchItems();

      toast.success("Successfully deleted.");
    } catch (error) {
      toast.error("Item not found.");
    }
  },

  // TOGGLE FAVORITE
  toggleFavorite: async (id) => {
    const db = await getDB();
    await db.execute(
      "UPDATE clipboards SET isFavorite = CASE WHEN isFavorite=1 THEN 0 ELSE 1 END WHERE id = ?",
      [id]
    );

    get().resetPagination();
    await get().fetchItems();
  },

  clearAll: async () => {
    const db = await getDB();
    await db.execute("DELETE FROM clipboards");

    set({ items: [] });

    await get().findCountedItems();
    toast("Cleared all clipboard data.");
  },

  // FILTER HANDLERS
  handleFilter: (type) => {
    set({ filterType: type });
    get().resetPagination();
    get().fetchItems();
  },

  handleSearch: (query) => {
    set({ searchQuery: query });
    get().resetPagination();
    get().fetchItems();
  },

  handleSorting: async () => {
    set((state) => ({ sortByDesc: !state.sortByDesc }));
    get().resetPagination();
    get().fetchItems();
  },

  handleFilterByDate: async (date) => {
    set({ filterDate: date });
    get().resetPagination();
    get().fetchItems();
  },

  // MOST RECENT ITEMS
  getMostRecentItems: async () => {
    const db = await getDB();
    const items = await db.select(
      "SELECT * FROM clipboards ORDER BY createdAt DESC LIMIT 2"
    );
    set({ mostRecentItems: items });
  },

  // COUNTS
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
}));
