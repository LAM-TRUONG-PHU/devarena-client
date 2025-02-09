"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "../globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Script from "next/script";
import Header from "@/components/header";
import DialogLoading from "@/components/dialog-loading";
import { useSession } from "next-auth/react";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
     const { data: session, status } = useSession()
      const router = useRouter()
      useEffect(() => {
         
          if (session?.user?.role === "client") {
              router.push("/study")
          }
      }, [session])
  return (
    <Suspense fallback={<div>loading</div>}>
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
    </Suspense>
  );
}
