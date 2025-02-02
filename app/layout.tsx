import Providers from "@/components/providers/providers";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import { Suspense } from "react";
import Loader from "@/components/layout/loader";
import { Inter } from "next/font/google";
import classNames from "classnames";

const inter = Inter({ subsets: ["latin"] });

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
          <main
            className={classNames(
              "grid grid-cols-[288px_1fr] grid-rows-[1fr] h-full relative",
              inter.className
            )}
          >
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
