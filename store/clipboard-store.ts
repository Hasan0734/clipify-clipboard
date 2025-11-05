import { ClipboardType } from "@/lib/types";
import { create } from "zustand";

const mockClipboardItems: ClipboardType[] = [
  {
    id: "1",
    type: "text" as const,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. sdf asf ads asdf sdf asdfsafdsf asd sdf adsf asf daf das fdaf asdf asdf asdfds fdfd fasdf af saddf  sdf sdfa fafa",
    timestamp: "2 hours ago",
    isFavorite: true,
  },
  {
    id: "2",
    type: "link" as const,
    content: "https://www.example.com/amazing-article-about-productivity",
    timestamp: "5 hours ago",
    isFavorite: false,
  },
  {
    id: "3",
    type: "image" as const,
    content: "/assets/sample-image.jpg",
    timestamp: "Yesterday",
    isFavorite: true,
  },
  {
    id: "4",
    type: "text" as const,
    content:
      "Remember to buy: eggs, milk, bread, coffee, and fruits from the grocery store tomorrow morning. sdfa sdf asdfasf fdsfasd fasdf asfasdfasfds f dsf dsfsafads",
    timestamp: "Yesterday",
    isFavorite: false,
  },
  {
    id: "5",
    type: "link" as const,
    content: "https://github.com/awesome-project/repository",
    timestamp: "2 days ago",
    isFavorite: false,
  },
  {
    id: "6",
    type: "text" as const,
    content:
      "Meeting notes: Discussed Q4 goals, new product launch timeline, and team expansion plans.",
    timestamp: "3 days ago",
    isFavorite: true,
  },
  {
    id: "7",
    type: "image" as const,
    content: "design_mockup.png",
    timestamp: "3 days ago",
    isFavorite: false,
  },
  {
    id: "8",
    type: "link" as const,
    content: "https://docs.example.com/api/reference",
    timestamp: "1 week ago",
    isFavorite: false,
  },
];

type ClipboardStore = {
  clipboards: ClipboardType[];
  toggleFavorite: (id: string) => void;
  handleFilter: (type: string) => void;
};

export const useClipboardStore = create<ClipboardStore>((set) => ({
  clipboards: mockClipboardItems,
  toggleFavorite: (id: string) => {
    set((state) => ({
      clipboards: state.clipboards.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      ),
    }));
  },
  handleFilter: (type) => {
    console.log(type)
    set((state) => ({
      clipboards:
        type === "all"
          ? mockClipboardItems
          : state.clipboards.filter((item) => item.type === type),
    }));
  },
}));
