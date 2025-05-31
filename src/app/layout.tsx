// import "jsvectormap/dist/jsvectormap.css";
import "@/css/satoshi.css";
import localFont from 'next/font/local'
import "@/css/style.css";
import { ToasterProvider } from "../components/ui/toaster";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="">
      <ToasterProvider />
        <div className={`dark:bg-boxdark-2 dark:text-bodydark min-h-screen bg-blue-sky`}>
          {children}
        </div>
      </body>
    </html>
  );
}


export const runtime = "edge";