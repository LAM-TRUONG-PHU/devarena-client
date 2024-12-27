"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "@/app/globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Header from "@/components/header";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="min-h-screen">
                    <Header showSidebar={true} />

                    <Provider store={store}>{children}</Provider>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
