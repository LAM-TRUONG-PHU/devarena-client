import { Suspense } from "react";
import "../globals.css";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
      <Suspense fallback={<div>loading</div>}>
                        <div className="min-h-screen flex items-center justify-center bg-background">{children}</div>

      </Suspense>
        
    );
}
