// import "jsvectormap/dist/jsvectormap.css";
import "@/css/satoshi.css";
import localFont from 'next/font/local'
import "@/css/style.css";
import { ToasterProvider } from "../components/ui/toaster";
import BarProvider from "@/context/BarContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="">
        <BarProvider>
          <ToasterProvider />
          <div className={`dark:bg-boxdark-2 dark:text-bodydark min-h-screen bg-blue-sky`}>
            {children}
          </div>
        </BarProvider>
      </body>
    </html>
  );
}
