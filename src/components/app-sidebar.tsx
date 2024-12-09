"use client";

import * as React from "react";
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Calendar,
    Command,
    Frame,
    GalleryVerticalEnd,
    Home,
    Inbox,
    Map,
    PieChart,
    Search,
    Settings,
    Settings2,
    SquareTerminalIcon,
    NotebookPenIcon,
    Trophy,
    SquareTerminal,
} from "lucide-react";
import { BsDiagram2 } from "react-icons/bs";

import Image from "next/image";
import { usePathname } from "next/navigation";

import { NavMain } from "@/components/nav-main";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const data = {
        user: {
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        navMain: [
            {
                title: "Study",
                url: pathname.startsWith("/admin/") ? "/admin/study" : "/study",
                icon: SquareTerminalIcon,
            },
            {
                title: "Algorithm",
                url: pathname.startsWith("/admin/") ? "/admin/algorithm" : "/algorithm",
                icon: BsDiagram2,
            },
            {
                title: "Contest",
                url: pathname.startsWith("/admin/") ? "/admin/contest" : "/contest",
                icon: Trophy,
            },
        ],
    };
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <Image
                        className="dark:invert"
                        src="/logo1.png"
                        alt="DevArena logo"
                        width={60}
                        height={60}
                    />
                    <span className="text-xl"> DevArena</span>
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    );
}
