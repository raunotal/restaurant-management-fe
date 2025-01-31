import Providers from "@/components/providers/providers";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import { Suspense } from "react";
import Loader from "@/components/layout/loader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="et" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/llq6uka.css"
        ></link>
      </head>
      <body className="h-full">
        <Providers>
          <main className="grid grid-cols-[288px_1fr] grid-rows-[1fr] h-full relative">
            <Sidebar />
            <Suspense fallback={<Loader />}>
              <div className="bg-gray-100 p-8">{children}</div>
            </Suspense>
          </main>
        </Providers>
      </body>
    </html>
  );
}
