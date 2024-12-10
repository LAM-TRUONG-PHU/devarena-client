"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon | React.FC<{}>;
        isActive: boolean;
    }[];
}) {
    return (
        <SidebarGroup>
            {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                style={{ width: "90%" }}
                                size="default"
                                isActive={item.isActive}
                                className={`${
                                    item.isActive
                                        ? "!bg-pink_background !text-pink_primary !font-semibold"
                                        : ""
                                } mx-auto !px-4 !rounded-lg`}
                            >
                                <Link href={item.url}>
                                    {item.icon && <item.icon style={{ width: "20px", height: "20px" }} />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
