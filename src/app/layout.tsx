// import "jsvectormap/dist/jsvectormap.css";
import "@/css/satoshi.css";
import localFont from 'next/font/local'
import "@/css/style.css";
import { ToasterProvider } from "../components/ui/toaster";

const glancyr = localFont({
  src: [
    {
      path: './../fonts/glancyr-glancyr-extra-light-100.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './../fonts/glancyr-glancyr-extra-light-italic-100.ttf',
      weight: '100',
      style: 'italic',
    },
    {
      path: './../fonts/glancyr-glancyr-light-200.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './../fonts/glancyr-glancyr-light-italic-200.ttf',
      weight: '200',
      style: 'italic',
    },
    {
      path: './../fonts/glancyr-glancyr-regular-400.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './../fonts/glancyr-glancyr-regular-italic-400.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './../fonts/glancyr-glancyr-medium-500.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './../fonts/glancyr-glancyr-medium-italic-500.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './../fonts/glancyr-glancyr-semibold-600.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './../fonts/glancyr-glancyr-semibold-italic-600.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: './../fonts/glancyr-glancyr-bold-700.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './../fonts/glancyr-glancyr-bold-italic-700.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
})

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
