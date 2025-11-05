import { ClipboardType } from "@/lib/types";
import { create } from "zustand";
import { generateShortId } from "@/lib/utils";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

type ClipboardStore = {
  clipboards: ClipboardType[];
  allClipboards: ClipboardType[];
  filterType: string;
  searchQuery: string;
  toggleFavorite: (id: string) => void;
  handleFilter: (type: string) => void;
  handleSearch: (query: string) => void;
  handleAddNew: (newitem: Partial<ClipboardType> & { content: string }) => void;
  applyFilters: () => void;
  deleteClipboard: (id: string) => void;
};

export const useClipboardStore = create<ClipboardStore>()(
  persist(
    (set, get) => ({
      allClipboards: [],
      clipboards: [],
      filterType: "all",
      searchQuery: "",

      applyFilters: () => {
        const { allClipboards, filterType, searchQuery } = get();

        const filtered = allClipboards.filter((item) => {
          const matchesType =
            filterType === "all"
              ? true
              : filterType === "favorite"
              ? item.isFavorite
              : item.type === filterType;

          const matchesSearch = item.content
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          return matchesType && matchesSearch;
        });

        set({ clipboards: filtered });
      },

      handleAddNew: (data) => {
        const { allClipboards, applyFilters } = get();

        const exists = allClipboards.some(
          (item) => item.content.trim() === data.content.trim()
        );
        if (exists) return console.log("Duplicate clip");

        const newItem: ClipboardType = {
          id: generateShortId(),
          timestamp: new Date(),
          type: data.type ?? "text",
          isFavorite: data.isFavorite ?? false,
          ...data,
        };

        const updated = [...allClipboards, newItem];
        set({ allClipboards: updated });
        applyFilters();
      },

      toggleFavorite: (id) => {
        const { allClipboards, applyFilters } = get();

        const updated = allClipboards.map((item) =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        );

        set({ allClipboards: updated });
        applyFilters();
      },

      handleFilter: (type) => {
        set({ filterType: type });
        get().applyFilters();
      },

      handleSearch: (query) => {
        set({ searchQuery: query });
        get().applyFilters();
      },
      deleteClipboard: (id) => {
        const { allClipboards, applyFilters } = get();

        const index = allClipboards.findIndex((item) => item.id === id);
        if (index === -1) return;

        const item = allClipboards[index];

        const updated = allClipboards.filter((item) => item.id !== id);
        set(() => ({ allClipboards: updated }));

        toast("Deleted successfully!", {
          description: "You successfully deleted clipboard!",
          action: {
            label: "Undo",
            onClick: () => {
              if (item) {
                set((state: ClipboardStore) => {
                  const restored = [...state.allClipboards];
                  // Insert back at the same index
                  restored.splice(index, 0, item);
                  return { allClipboards: restored };
                });
              }
              applyFilters();
            },
          },
        });

        applyFilters();
      },
    }),
    {
      name: "clipboard-storage",
      partialize: (state) => ({
        allClipboards: state.allClipboards,
        clipboards: state.clipboards,
        filterType: state.filterType,
      }),
    }
  )
);
