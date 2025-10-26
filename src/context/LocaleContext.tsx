'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Locale, locales, defaultLocale } from '@/i18n/config';
import LoadingPage from '@/components/Loading/LoadingPage';
import { setUserLocale } from '@/services/locale';


interface LocaleContextType {
  locale: Locale;
  changeLocale: (newLocale: Locale) => void;
  isLoading: boolean;
}

// Context
const LocaleContext = createContext<LocaleContextType | null>(null);

// Constante pour le cookie (même nom que dans locale.ts)
const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

interface LocaleProviderProps {
  children: ReactNode;
  initialMessages: Record<string, any>;
  initialLocale?: Locale;
}

export function LocaleProvider({ children, initialMessages, initialLocale }: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale || defaultLocale);
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingLocale, setIsChangingLocale] = useState(false);

  // Fonction pour lire le cookie côté client
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  // Initialiser la locale depuis le cookie uniquement au montage
  useEffect(() => {
    const initLocale = () => {
      try {
        const cookieLocale = getCookie(LOCALE_COOKIE_NAME) as Locale;
        if (cookieLocale && locales.includes(cookieLocale) && cookieLocale !== locale) {
          loadLocale(cookieLocale, false);
        }
      } catch (error) {
        console.error('Erreur lors de la lecture du cookie:', error);
      }
    };

    initLocale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fonction pour charger une nouvelle locale
  const loadLocale = async (newLocale: Locale, updateCookie: boolean = true) => {
    if (newLocale === locale && !isLoading) return;

    setIsChangingLocale(true);

    try {
      const newMessages: Record<string, any> = (await import(`../../messages/${newLocale}.json`)).default;
      setLocale(newLocale);
      setMessages(newMessages);

      // Mettre à jour le cookie via l'action serveur
      if (updateCookie) {
        await setUserLocale(newLocale);
      }

    } catch (error) {
      console.error('Erreur lors du chargement de la locale:', error);
    } finally {
      setIsChangingLocale(false);
    }
  };

  const changeLocale = (newLocale: Locale) => {
    loadLocale(newLocale, true);
  };

  const contextValue: LocaleContextType = {
    locale,
    changeLocale,
    isLoading: isChangingLocale
  };

  if (isLoading) {
    return (<LoadingPage />);
  }

  return (
    <LocaleContext.Provider value={contextValue}>
      <NextIntlClientProvider 
        locale={locale} 
        messages={messages}
        key={locale} // Force le re-render quand la locale change
        timeZone="Europe/Paris"
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

// Hook personnalisé pour utiliser le context
export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocaleContext doit être utilisé à l\'intérieur d\'un LocaleProvider');
  }
  return context;
}