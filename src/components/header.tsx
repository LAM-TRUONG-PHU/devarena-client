import { Separator } from "@/components/ui/separator";
import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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
import { ChevronLeft } from "lucide-react";
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatar.jpg",
    },
};
type HeaderProps = {
    showSidebar?: boolean;
};
export default function Header(props: HeaderProps) {
    const router = useRouter();
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
            <header className="flex h-16 shrink-0 items-center gap-2 border-pink_primary border-b-2 px-4 bg-white relative">
                {props.showSidebar ? (
                    <>
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                    </>
                ) : (
                    <div
                        className={`${
                            props.showSidebar ? "w-1/3" : "w-1/4"
                        } flex items-center gap-2 absolute left-4 hover:text-pink_primary transition-all cursor-pointer`}
                        onClick={() => router.back()}
                    >
                        <ChevronLeft size={20} />
                        <div className="text-sm">Back to previous page</div>
                    </div>
                )}

                <Breadcrumb className={`w-full ${!props.showSidebar && "flex justify-center"}`}>
                    <BreadcrumbList>
                        {segments.map((segment, index) => {
                            const isLast = index === segments.length - 1;
                            const path = `/${segments.slice(0, index + 1).join("/")}`;

                            return (
                                <React.Fragment key={path}>
                                    {index > 0 && <BreadcrumbSeparator />}
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <span className="font-semibold">
                                                {capitalize(decodeURIComponent(segment))}
                                            </span>
                                        ) : (
                                            <Link
                                                href={path}
                                                className="hover:text-pink_primary transition-all"
                                            >
                                                {capitalize(decodeURIComponent(segment))}
                                            </Link>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>

                <div
                    className={`${
                        props.showSidebar ? "w-1/3" : "w-1/4"
                    } flex items-center gap-4 absolute right-0`}
                >
                    <NavUser user={data.user} />
                </div>
            </header>
        </>
    );
}
