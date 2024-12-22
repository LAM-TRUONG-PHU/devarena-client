"use client";
import "@/app/globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import NextAuthWrapper from "@/context/SessionWrapper";
import { store } from "@/redux/store";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname(); // Get the current path
    const showSidebar = !/^\/(study\/[a-zA-Z0-9+]+\/.+|algorithm\/.+)/.test(pathname); // Hide sidebar for specific patterns
    const isSpecialPage = pathname === "/profile" || pathname === "/account-management";

    return (
      <>
                <SidebarProvider>
                    {showSidebar && <AppSidebar isSpecialPage={isSpecialPage} />}
                    <SidebarInset>
                        <div className={`${showSidebar ? "min-h-screen" : "relative"}`}>
                            {isSpecialPage ? (
                                <Header isSpecialPage={isSpecialPage} />
                            ) : (
                                <Header showSidebar={showSidebar} />
                            )}
                            <div>
                                <Provider store={store}>{children}</Provider>
                            </div>
                        </div>
                        <Toaster />
                        {showSidebar && <Footer />}
                    </SidebarInset>
                </SidebarProvider>
         
                </>

      
    );
}
