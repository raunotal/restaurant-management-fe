import Providers from "@/components/providers/providers";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import { Suspense } from "react";
import Loader from "@/components/layout/loader";
import { Inter } from "next/font/google";
import classNames from "classnames";
import { Toaster } from "react-hot-toast";
import { auth, signOut } from "@/lib/auth-config";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session?.expires) {
    const sessionExpires = new Date(session.expires);
    if (sessionExpires.getTime() < Date.now()) {
      signOut();
    }
  }

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
              <div className="bg-gray-100 p-8">
                <Toaster />
                {children}
              </div>
            </Suspense>
          </main>
        </Providers>
      </body>
    </html>
  );
}
