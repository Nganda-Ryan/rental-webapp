'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from '../hooks/useLocale';
import { Locale, locales } from '@/i18n/config';

const languageNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français'
};

export default function LanguageSelector() {
  const { locale, changeLocale, isLoading } = useLocale();
  const t = useTranslations('Settings');

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value as Locale;
    changeLocale(newLocale);
  };

  return (
    <>
      
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{t('language')}:</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('chooseYourPreferredLanguage')}</p>
            </div>
            <select 
              id="language-select"
              value={locale} 
              onChange={handleLanguageChange}
              disabled={isLoading}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              {locales.map((loc) => (
                <option key={loc} value={loc}>
                  {languageNames[loc]}
                </option>
              ))}
            </select>
          </div>
        </div>
    </>
  );
}