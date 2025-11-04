"use client"
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
import {FileText, Image, Link2, Star, Layers, Clipboard} from "lucide-react";
import {useState} from "react";

const filters = [
    {id: "all", label: "All Clips", icon: Layers},
    {id: "text", label: "Text", icon: FileText},
    {id: "images", label: "Images", icon: Image},
    {id: "links", label: "Links", icon: Link2},
    {id: "favorites", label: "Favorites", icon: Star},
];

export function AppSidebar() {

    const [isActive, setIsActive] = useState('all'
    )
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl shadow-lg">
                        <Clipboard className="w-6 h-6 text-primary dark:text-white"/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold dark:text-white text-primary">
                            Clipify
                        </h1>
                        <p className="text-xs text-muted-foreground">Smart Clipboard Manager</p>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Filters</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filters.map(item => <SidebarMenuItem key={item.id}>
                                <SidebarMenuButton
                                    size={'lg'}
                                    onClick={() => {
                                        setIsActive(item.id
                                        )
                                    }}
                                    isActive={isActive === item.id}
                                    className={'rounded-[10px]  cursor-pointer'}>
                                    {<item.icon/>} {item.label}
                                </SidebarMenuButton>
                            </SidebarMenuItem>)}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
