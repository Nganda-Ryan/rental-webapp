import "@/css/satoshi.css";
import 'react-phone-number-input/style.css';
import {getLocale, getMessages} from 'next-intl/server';
import "@/css/style.css";
import { ToasterProvider } from "../components/ui/toaster";
import BarProvider from "@/context/BarContext";
import { LocaleProvider } from "@/context/LocaleContext";

async function getInitialMessages() {
  return (await import('../../messages/en.json')).default;
}

export default async  function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const messages = await getMessages();
    const locale = await getLocale();
    const initialMessages = await getInitialMessages();
  return (
    <html lang={locale}>
      <body suppressHydrationWarning={true} className="">
        <BarProvider>
          <ToasterProvider />
          <div className={`dark:bg-boxdark-2 dark:text-bodydark min-h-screen bg-blue-sky`}>
            <LocaleProvider initialMessages={initialMessages}>
              {children}
            </LocaleProvider>
          </div>
        </BarProvider>
      </body>
    </html>
  );
}
