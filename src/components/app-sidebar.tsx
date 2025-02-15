"use client";

import * as React from "react";
import { BsDiagram2 } from "react-icons/bs";

import Image from "next/image";
import { usePathname } from "next/navigation";

import { NavMain } from "@/components/nav-main";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuButton,
    SidebarRail
} from "@/components/ui/sidebar";
import { SiCodecrafters } from "react-icons/si";
import NavUser from "./nav-user";

// This is sample data.

type AppSidebarProps = {
    isSpecialPage?: boolean;
    isClient?: boolean;
} & React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ isSpecialPage, isClient, ...props }: AppSidebarProps) {
    const pathname = usePathname();
    const data = {
        user: {
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatar.jpg",
        },
        navMain: [
            {
                title: "Study",
                url: pathname.startsWith("/admin") ? "/admin/study" : "/study",
                icon: SiCodecrafters,
                isActive: pathname.startsWith("/study") || pathname.startsWith("/admin/study"),
            },
            {
                title: "Algorithm",
                url: pathname.startsWith("/admin") ? "/admin/algorithm" : "/algorithm",
                icon: BsDiagram2,
                isActive: pathname.startsWith("/algorithm") || pathname.startsWith("/admin/algorithm"),
            },
            // {
            //     title: "Arena",
            //     url: pathname.startsWith("/admin") ? "/admin/arena" : "/arena",
            //     icon: Trophy,
            //     isActive: pathname.startsWith("/arena") || pathname.startsWith("/admin/arena"),
            // },
        ],
    };
    return (
        <Sidebar collapsible={isSpecialPage ? "offcanvas" : "icon"} {...props} open={!isSpecialPage}>
            <SidebarHeader className="!border-b-2 !border-gray">
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mx-auto"
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
            <SidebarFooter>
                {!isClient && <NavUser />}
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
