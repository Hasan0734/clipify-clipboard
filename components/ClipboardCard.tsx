"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  FileText,
  Link2,
  Star,
  Image as ImageIcon,
  Check,
  Copy,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { ClipboardItem } from "@/lib/types";
import { formatDistance } from "date-fns";
import { writeText } from "tauri-plugin-clipboard-api";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useClipboardStore } from "@/store/useClipboardStore";
import { cn } from "@/lib/utils";
import FullViewContent from "./FullViewContent";

const typeIcons = {
  text: FileText,
  image: ImageIcon,
  link: Link2,
} as const;

const ClipboardCard = ({ data }: { data: ClipboardItem }) => {
  const toggleFavorite = useClipboardStore((state) => state.toggleFavorite);
  const deleteClipboard = useClipboardStore((state) => state.deleteItem);

  const Icon = typeIcons[data.type];

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await writeText(data.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = (id: string) => {
    toggleFavorite(id);
  };

  const handleDelete = () => {
    deleteClipboard(data.id);
  };

  return (
    <Card
      className={cn(
        "@container/card rounded-xl shadow-xl hover:shadow-2xl p-3 gap-0 w-full "
      )}
    >
      <CardHeader className="p-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium capitalize">{data.type}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFavorite(data.id)}
              className="p-1 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <Star
                className={`w-5 h-5 transition-colors ${
                  data.isFavorite
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            </button>

            <FullViewContent data={data} />
            <button
              className="p-1 rounded-lg hover:bg-accent/50 transition-colors"
              onClick={handleDelete}
            >
              <Trash2 className="w-5 h-5 transition-colors"/>
            </button>

            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-lg hover:bg-accent/50 transition-colors">
                  <EllipsisVertical className="size-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={2} alignOffset={-5} align="end">
                <DropdownMenuItem>
                  <SquarePen /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash2 /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {data.type === "text" ? (
          <p className="dark:text-gray-400 text-base line-clamp-5 wrap-break-word">
            {data.content}
          </p>
        ) : data.type === "link" ? (
          <p
            onClick={async () => {
              await openUrl(data.content);
            }}
            className="text-blue-400 text-base hover:underline line-clamp-5 wrap-break-word cursor-pointer"
          >
            {data.content}
          </p>
        ) : (
          <div
            className="w-full h-28 overflow-hidden bg-gradient-to-br from-primary/5
           to-accent/5 rounded flex items-center justify-center"
          >
            <Image
              src={"/assets/sample-image.jpg"}
              alt=""
              width={300}
              height={120}
            />
          </div>
        )}
      </CardContent>

      <CardFooter className=" mt-auto px-2 flex justify-between  w-full text-sm border-t pt-2!">
        <div className="flex items-center justify-between w-full text-sm">
          <p className="text-muted-foreground">
            {formatDistance(data.createdAt, new Date(), {
              addSuffix: true,
            })}
          </p>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={handleCopy}
            className="gap-2 hover:bg-primary/10"
          >
            {copied ? (
              <>
                <Check />
                {/* <span className="text-xs">Copied!</span> */}
              </>
            ) : (
              <>
                <Copy />
                {/* <span className="text-xs">Copy</span> */}
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClipboardCard;
