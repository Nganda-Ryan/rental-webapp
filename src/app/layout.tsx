import "@/css/satoshi.css";
import 'react-phone-number-input/style.css';
import {getLocale, getMessages} from 'next-intl/server';
import "@/css/style.css";
import { ToasterProvider } from "../components/ui/toaster";
import BarProvider from "@/context/BarContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { Locale } from "@/i18n/config";

export default async  function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const locale = await getLocale() as Locale;
    const messages = await getMessages();

  return (
    <html lang={locale}>
      <body suppressHydrationWarning={true} className="">
        <BarProvider>
          <ToasterProvider />
          <div className={`dark:bg-boxdark-2 dark:text-bodydark min-h-screen bg-blue-sky`}>
            <LocaleProvider initialMessages={messages} initialLocale={locale}>
              {children}
            </LocaleProvider>
          </div>
        </BarProvider>
      </body>
    </html>
  );
}
