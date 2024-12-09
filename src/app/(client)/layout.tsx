"use client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased`}>
                <SidebarProvider>
                    <AppSidebar />
                    <Provider store={store}>{children}</Provider>
                </SidebarProvider>
            </body>
        </html>
    );
}
