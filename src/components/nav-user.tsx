import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, Sparkles, BadgeCheck, CreditCard, Bell, LogOut } from "lucide-react";
import React from "react";
import { SidebarMenuButton, useSidebar } from "./ui/sidebar";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function NavUser({
    user,
}: {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
}) {
    const { isMobile } = useSidebar();
    const router = useRouter();
    const handleLogout = async () => {
        await signOut({
            redirect: true,  // Redirect the user after logging out
            callbackUrl: '/auth/login',
        });
    };


    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                        size="lg"
                        className=" data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground p-0"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} className="rounded-full" />
                            <AvatarFallback> {user.name[0]}</AvatarFallback>
                        </Avatar>
                        <>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user.name}</span>
                                <span className=" text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </>
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side={isMobile ? "bottom" : "bottom"}
                    align="end"
                    sideOffset={4}
                >
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Sparkles />
                            Upgrade to Pro
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={() => {
                                router.push("/profile");
                            }}
                        >
                            <BadgeCheck />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                router.push("/account-management");
                            }}
                        >
                            <CreditCard />
                            Account Management
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Bell />
                            Notifications
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
