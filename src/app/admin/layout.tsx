"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "@/app/globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
     
                <SidebarProvider>
                    <AppSidebar />
                    <main className="w-full">
                        <SidebarTrigger />
                        <Provider store={store}>{children}</Provider>
                    </main>
                </SidebarProvider>
     
    );
}
