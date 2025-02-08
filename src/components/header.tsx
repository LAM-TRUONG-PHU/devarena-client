import { Separator } from "@/components/ui/separator";
import { Heart } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import { isValidLanguage } from "@/utils/is-valid-language";
import { getLanguageTitle } from "@/utils/get-language-title";
import Image from "next/image";
import { Url } from "next/dist/shared/lib/router/router";
import { useSession } from "next-auth/react";

// const data = {
//     user: {
//         name: "shadcn",
//         email: "m@example.com",
//         avatar: "/avatar.jpg",
//     },
// };
type HeaderProps = {
    showSidebar?: boolean;
    isSpecialPage?: boolean;
};
export default function Header(props: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const [isMobile, setIsMobile] = useState(false);
    const { data: session } = useSession()
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Mobile width threshold
        };

        // Initial check
        handleResize();

        // Add resize event listener
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const capitalize = (str: string) => {
        return str
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const HoverUnderlineText = ({ text, href }: { text: String; href: Url }) => (
        <Link className="group w-fit relative" href={href}>
            <div className="group-hover:text-pink_primary transition-all">{text}</div>
            <span className="absolute -bottom-1 left-0 w-0 transition-all h-0.5 bg-pink_primary group-hover:w-full"></span>
        </Link>
    );

    return (
        <>
            <header
                className={`${props.isSpecialPage && "sticky top-0"
                    } flex   h-16 shrink-0 items-center gap-2 border-pink_primary border-b-2 px-4 bg-white relative z-20`}
            >
                {props.showSidebar ? (
                    <>
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                    </>
                ) : props.isSpecialPage && isMobile ? (
                    <SidebarTrigger className="" />
                ) : props.isSpecialPage ? (
                    <div className="flex items-center gap-2 absolute left-12 transition-all cursor-pointer">
                        <Image
                            className="dark:invert"
                            src="/logo1.png"
                            alt="DevArena logo"
                            width={40}
                            height={40}
                            onClick={() => router.push("/")}
                        />
                        <Separator orientation="vertical" className="mx-12 h-8" />
                        <div className="flex gap-12">
                            <HoverUnderlineText text="Study" href="/study" />
                            <HoverUnderlineText text="Algorithm" href="/algorithm" />
                            {/* <HoverUnderlineText text="Arena" href="/arena" /> */}
                        </div>
                    </div>
                ) : (
                    <div
                        className={`${props.showSidebar ? "w-1/3" : "w-1/4"
                            } flex items-center gap-2 absolute left-4 hover:text-pink_primary transition-all cursor-pointer`}
                        onClick={() => router.back()}
                    >
                        <ChevronLeft size={20} />
                        <div className="text-sm">Back to previous page</div>
                    </div>
                )}
                {!props.isSpecialPage && (
                    <Breadcrumb className={`w-full ${!props.showSidebar && "flex justify-center"}`}>
                        <BreadcrumbList>
                            {segments.map((segment, index) => {
                                const isLast = index === segments.length - 1;
                                const path = `/${segments.slice(0, index + 1).join("/")}`;
                                const label = capitalize(decodeURIComponent(segment));

                                return (
                                    <React.Fragment key={path}>
                                        {index > 0 && <BreadcrumbSeparator />}
                                        <BreadcrumbItem>
                                            {isLast ? (
                                                <span className="font-semibold">{label}</span>
                                            ) : index === segments.length - 2 ? (
                                                // If this is the second-to-last segment (e.g., the [java] level), handle back navigation
                                                <span
                                                    onClick={() => router.back()}
                                                    className="hover:text-pink_primary transition-all cursor-pointer"
                                                >
                                                    {label}
                                                </span>
                                            ) : (
                                                // Regular breadcrumb links
                                                <Link
                                                    href={path}
                                                    className="hover:text-pink_primary transition-all"
                                                >
                                                    {label}
                                                </Link>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                );
                            })}
                        </BreadcrumbList>

                    </Breadcrumb>
                )}

                <div
                    className={`${props.showSidebar || props.isSpecialPage ? "lg:w-1/3 w-2/5" : "w-1/4"
                        } flex items-center gap-4 absolute right-0`}
                >
                    <NavUser />
                </div>
            </header>
        </>
    );
}
