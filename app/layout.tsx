import { Inter } from "next/font/google";
import Providers from "@/components/providers/providers";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import classNames from "classnames";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="et" className={classNames(inter.className, "h-full")}>
      <body className="h-full">
        <Providers>
          <main className="grid grid-cols-[288px_1fr] grid-rows-[1fr] h-full">
            <Sidebar />
            <div className="bg-gray-50">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
