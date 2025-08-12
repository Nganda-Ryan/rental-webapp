'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useState, useEffect } from 'react';
import { useLocale } from '../hooks/useLocale';
import LoadingPage from './Loading/LoadingPage';

interface LocaleProviderProps {
  children: ReactNode;
  initialMessages: Record<string, any>;
}

export default function LocaleProvider({ 
  children, 
  initialMessages 
}: LocaleProviderProps) {
  const { locale, isLoading } = useLocale();
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    if (!isLoading && locale) {
      import(`../../messages/${locale}.json`)
        .then((module) => setMessages(module.default))
        .catch((error) => console.error('Erreur lors du chargement des messages:', error));
    }
  }, [locale, isLoading]);

  if (isLoading) {
    return <LoadingPage />; // Ou votre composant de loading
  }

  return (
    <NextIntlClientProvider 
      locale={locale} 
      messages={messages}
      timeZone="Europe/Paris" // Ajustez selon vos besoins
    >
      {children}
    </NextIntlClientProvider>
  );
}