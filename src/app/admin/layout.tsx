"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "@/app/globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Script from "next/script";
import Header from "@/components/header";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Script
        src="https://upload-widget.cloudinary.com/latest/global/all.js"
        onLoad={() => {
          console.log("Cloudinary Widget Script Loaded");
          //   setInit(true);
        }}
      />
      <main className="w-full">
        <SidebarTrigger />
        <Provider store={store}>{children}</Provider>
      </main>
    </SidebarProvider>
  );
}
