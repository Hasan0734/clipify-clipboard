"use client";
import React, { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  FileText,
  Link2,
  Star,
  Layers,
  ClipboardList,
  ChartSpline,
  Clipboard,
} from "lucide-react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppStore } from "@/store/useAppStore";
import { useClipboardStore } from "@/store/useClipboardStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFocusedPasteListener } from "@/hooks/useFocusedPasteListener";

const filters = [
  { id: "all", label: "All Clips", icon: Layers, count: 212 },
  { id: "text", label: "Text", icon: FileText, count: 33 },
  // { id: "image", label: "Images", icon: Image, count: 11 },
  { id: "link", label: "Links", icon: Link2, count: 2 },
  { id: "favorite", label: "Favorites", icon: Star, count: 4 },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  useFocusedPasteListener();


  const { filterType, handleFilter, findCountedItems, count } =
    useClipboardStore();

  const itemCounts = {
    all: count?.total,
    text: count?.totalText,
    // image: allClipboards.filter((item) => item.type === "image").length,
    link: count?.totalLink,
    favorite: count?.totalFavorite,
  };

  useEffect(() => {
    findCountedItems();
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl shadow-lg">
            <ClipboardList className="w-6 h-6 text-primary dark:text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold dark:text-white text-primary">
              Clipify
            </h1>
            {/*<p className="text-xs text-muted-foreground"></p>*/}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href={"/"} replace>
                  <SidebarMenuButton isActive={pathname === "/"}>
                    <Clipboard /> Clipboard
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href={"/analytics"} replace>
                  <SidebarMenuButton isActive={pathname === "/analytics"}>
                    <ChartSpline /> Analytics
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {pathname === "/" && (
          <SidebarGroup>
            <SidebarGroupLabel>Filters</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filters.map((item) => {
                  const count = itemCounts[item.id as keyof typeof itemCounts];
                  const active = filterType === item.id;

                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        size={"lg"}
                        onClick={() => {
                          handleFilter(item.id);
                        }}
                        isActive={active}
                        className={"rounded-md  cursor-pointer w-full  h-9"}
                      >
                        {<item.icon />}
                        <div className={"grow flex justify-between "}>
                          {item.label}{" "}
                          <span className={"font-semibold"}>{count}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your clipboard history is stored locally and synced across
                devices.
              </p>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-center">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <span>+</span>
            <Kbd>V</Kbd>
          </KbdGroup>
          <span className="text-muted-foreground px-3">or</span>
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <span>+</span>
            <Kbd>V</Kbd>
          </KbdGroup>
        </div>
        <AlertDialog>
          <AlertDialogTrigger
            asChild
            className="flex justify-center text-muted-foreground"
          >
            <Button variant={"ghost"} className="" size={"sm"}>
              Reset app
            </Button>
          </AlertDialogTrigger>
          <ResetDialog />
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  );
}

const ResetDialog = () => {
  const { resetApp } = useAppStore();

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          clipboards data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => resetApp()}>
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
