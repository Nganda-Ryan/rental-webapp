'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Locale, locales } from '@/i18n/config';
import LoadingPage from '@/components/Loading/LoadingPage';


interface LocaleContextType {
  locale: Locale;
  changeLocale: (newLocale: Locale) => void;
  isLoading: boolean;
}

// Context
const LocaleContext = createContext<LocaleContextType | null>(null);

// Constante pour localStorage
const LOCALE_STORAGE_KEY = 'user-locale';

interface LocaleProviderProps {
  children: ReactNode;
  initialMessages: Record<string, any>;
}

export function LocaleProvider({ children, initialMessages }: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>('fr');
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingLocale, setIsChangingLocale] = useState(false);

  // Initialiser la locale depuis localStorage
  useEffect(() => {
    const initLocale = () => {
      try {
        const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale;
        if (savedLocale && locales.includes(savedLocale)) {
          loadLocale(savedLocale);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Erreur lors de la lecture du localStorage:', error);
        setIsLoading(false);
      }
    };

    initLocale();
  }, []);

  // Fonction pour charger une nouvelle locale
  const loadLocale = async (newLocale: Locale) => {
    if (newLocale === locale && !isLoading) return;
    
    setIsChangingLocale(true);
    
    try {
      const newMessages: Record<string, any> = (await import(`../../messages/${newLocale}.json`)).default;
      console.log('-->newMessages', newMessages);
      setLocale(newLocale);
      setMessages(newMessages);
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      
    } catch (error) {
      console.error('Erreur lors du chargement de la locale:', error);
    } finally {
      setIsLoading(false);
      setIsChangingLocale(false);
    }
  };

  const changeLocale = (newLocale: Locale) => {
    loadLocale(newLocale);
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