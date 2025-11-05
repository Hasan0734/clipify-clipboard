"use client";
import React, { useState } from "react";
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
  Image as Imageicon,
  Check,
  Copy,
  EllipsisVertical,
  SquarePen,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { ClipboardType } from "@/lib/types";
import { useClipboardStore } from "@/store/clipboard-store";
import { formatDistance, subDays } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";

type ClipType = "text" | "image" | "link";

const typeIcons = {
  text: FileText,
  image: Imageicon,
  link: Link2,
} as const;

const ClipboardCard = ({ data }: { data: ClipboardType }) => {
  const toggleFavorite = useClipboardStore((state) => state.toggleFavorite);
  const deleteClipboard = useClipboardStore((state) => state.deleteClipboard);

  const Icon = typeIcons[data.type];

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.content);
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
    <Card className="@container/card rounded-xl shadow-xl hover:shadow-2xl p-3 gap-0 w-full ">
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
            <Dialog>
              <DialogTrigger asChild>
                <button className="p-1 rounded-lg hover:bg-accent/50 transition-colors">
                  <Eye className={`w-5 h-5 transition-colors `} />
                </button>
              </DialogTrigger>
              <DialogContent>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium capitalize">
                    {data.type}
                  </span>
                </div>
                <div className="min-h-32">
                  {data.type === "text" ? (
                    <p className="dark:text-gray-400 text-base line-clamp-5 wrap-break-word">
                      {data.content}
                    </p>
                  ) : data.type === "link" ? (
                    <a
                      href={data.content}
                      className="text-blue-400 text-base hover:underline line-clamp-5 wrap-break-word"
                      target="_blank"
                    >
                      {data.content}
                    </a>
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
                </div>
                <div className="flex items-center justify-between w-full text-sm border-t pt-3">
                  <p className="text-muted-foreground">
                    {formatDistance(data.timestamp, new Date(), {
                      addSuffix: true,
                    })}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopy}
                    className="gap-2 hover:bg-primary/10"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span className="text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
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
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {data.type === "text" ? (
          <p className="dark:text-gray-400 text-base line-clamp-5 wrap-break-word">
            {data.content}
          </p>
        ) : data.type === "link" ? (
          <a
            href={data.content}
            className="text-blue-400 text-base hover:underline line-clamp-5 wrap-break-word"
            target="_blank"
          >
            {data.content}
          </a>
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

      <CardFooter className=" mt-auto flex justify-between  w-full text-sm border-t pt-2!">
        <div className="flex items-center justify-between w-full text-sm">
          <p className="text-muted-foreground">
            {formatDistance(data.timestamp, new Date(), {
              addSuffix: true,
            })}
          </p>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="gap-2 hover:bg-primary/10"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                <span className="text-xs">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="text-xs">Copy</span>
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClipboardCard;
