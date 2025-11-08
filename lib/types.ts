export type ClipboardType = {
  id: string;
  type: "text" | "image" | "link";
  content: string;
  timestamp: Date;
  isFavorite: boolean;
};

export type ClipboardItem = {
  id: string;
  content: string;
  type: "text" | "image" | "link";
  isFavorite: boolean;
  createdAt: number;
};
