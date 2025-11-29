import { ClipboardItem } from "@/lib/types";
import React, { useState } from "react";
import { writeText } from "tauri-plugin-clipboard-api";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import Image from "next/image";
import { formatDistance } from "date-fns";
import { Button } from "./ui/button";
import { Check, Copy, Eye, FileText, ImageIcon, Link2 } from "lucide-react";
import { openUrl } from "@tauri-apps/plugin-opener";


const typeIcons = {
  text: FileText,
  image: ImageIcon,
  link: Link2,
} as const;


const FullViewContent = ({ data }: { data: ClipboardItem }) => {
  const [copied, setCopied] = useState(false);

  const Icon = typeIcons[data.type];


  const handleCopy = async () => {
    await writeText(data.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-1 rounded-lg hover:bg-accent/50 transition-colors">
          <Eye className={`w-5 h-5 transition-colors `} />
        </button>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <DialogTitle>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium capitalize">{data.type}</span>
          </div>
        </DialogTitle>

        <div className="min-h-32 max-h-82 overflow-y-auto">
          {data.type === "text" ? (
            <p className="dark:text-gray-400 text-base ">
              {data.content}
            </p>
          ) : data.type === "link" ? (
            <p
              onClick={async () => {
                await openUrl(data.content);
              }}
              className="text-blue-400 text-base hover:underline  break-all cursor-pointer"
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
        </div>
        <div className="flex items-center justify-between w-full text-sm border-t pt-3">
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
                <Check className="w-3 h-3" />
                {/* <span className="text-xs">Copied!</span> */}
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                {/* <span className="text-xs">Copy</span> */}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullViewContent;
