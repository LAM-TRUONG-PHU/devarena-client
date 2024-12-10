"use client";
import "@/app/globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { store } from "@/redux/store";
import { Provider } from "react-redux";

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
                    <SidebarInset>
                        <Header />
                        <div className="flex flex-1 flex-col gap-4">
                            <Provider store={store}>{children}</Provider>
                        </div>
                        <Footer />
                    </SidebarInset>
                </SidebarProvider>
            </body>
        </html>
    );
}
