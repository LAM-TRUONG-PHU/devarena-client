import { Separator } from "@/components/ui/separator";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import NavUser from "./nav-user";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "./ui/breadcrumb";
import Link from "next/link";
import { SidebarTrigger } from "./ui/sidebar";
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
    const capitalize = (str: string) => {
        return str
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

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
                                            <Link href={path}>{capitalize(decodeURIComponent(segment))}</Link>
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
