"use client";
import React, { useEffect, useState } from "react";
import ClipboardCard from "./ClipboardCard";
import { useClipboardStore } from "@/store/clipboard-store";
import { Button } from "./ui/button";
import { Calendar, SortAsc } from "lucide-react";
import SearchBar from "./SearchBar";

const mockClipboardItems = [
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

const Clipboards = () => {
  const [clipboardText, setClipboardText] = useState("");
  const clipboards = useClipboardStore((state) => state.clipboards);
  const handleAddNew = useClipboardStore((state) => state.handleAddNew);

//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     function startPolling() {
//       interval = setInterval(async () => {
//         try {
//           const text = await navigator.clipboard.readText();
//           if (text && text !== clipboardText) handleAddNew({content: text});
//         } catch {}
//       }, 2000);
//     }

//     function stopPolling() {
//       clearInterval(interval);
//     }

//     window.addEventListener("focus", startPolling);
//     window.addEventListener("blur", stopPolling);

//     startPolling();

//     return () => {
//       window.removeEventListener("focus", startPolling);
//       window.removeEventListener("blur", stopPolling);
//       clearInterval(interval);
//     };
//   }, [clipboardText]);

  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-center  mb-10">
        {/* <h2 className="">{clipboards.length} items</h2> */}

        <div className="space-x-2 flex ">
          <SearchBar />
          <Button variant={"outline"}>
            Sort by <SortAsc />
          </Button>
          <Button variant={"outline"}>
            By Date <Calendar />
          </Button>
        </div>
      </div>

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-liner-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 @7xl/main:grid-cols-4">
        {clipboards.length > 0 ? (
          clipboards.map((item) => <ClipboardCard key={item.id} data={item} />)
        ) : (
          <div>Not found any items</div>
        )}
      </div>
    </div>
  );
};

export default Clipboards;
