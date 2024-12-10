import React from "react";
import { SidebarMenuButton, SidebarTrigger } from "./ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "./ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { ChevronsUpDown, Sparkles, BadgeCheck, CreditCard, Bell, LogOut, Heart } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import NavUser from "./nav-user";
import { usePathname } from "next/navigation";
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatar.jpg",
    },
};
export default function Header() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-pink_primary border-b-2 px-4 bg-white">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb className="w-full">
                    <BreadcrumbList>
                        {segments.map((segment, index) => {
                            const isLast = index === segments.length - 1;
                            const path = `/${segments.slice(0, index + 1).join("/")}`;

                            return (
                                <React.Fragment key={path}>
                                    {index > 0 && <BreadcrumbSeparator />}
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <span>{capitalize(decodeURIComponent(segment))}</span>
                                        ) : (
                                            <BreadcrumbLink href={path}>
                                                {capitalize(decodeURIComponent(segment))}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="w-1/3 flex items-center gap-4">
                    <Heart className="hover:text-pink_primary" />
                    <NavUser user={data.user} />
                </div>
            </header>
        </>
    );
}
