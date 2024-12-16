"use client";
import "@/app/globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { store } from "@/redux/store";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname(); // Get the current path
    const showSidebar = !/^\/study\/[a-zA-Z0-9+]+\/.+/.test(pathname);
    return (
        <html lang="en">
            <body className={`antialiased`}>
                <SidebarProvider>
                    {showSidebar && <AppSidebar />}
                    <SidebarInset>
                        <div className={`${showSidebar && "min-h-screen"}`}>
                            <Header showSidebar={showSidebar} />
                            <div className="flex flex-1 flex-col">
                                <Provider store={store}>{children}</Provider>
                            </div>
                        </div>

                        {showSidebar && <Footer />}
                    </SidebarInset>
                </SidebarProvider>
            </body>
        </html>
    );
}
