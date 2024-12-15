import "@/app/globals.css";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <div className="min-h-screen flex items-center justify-center bg-background">{children}</div>
            </body>
        </html>
    );
}
