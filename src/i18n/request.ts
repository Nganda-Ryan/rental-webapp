import {getRequestConfig} from 'next-intl/server';
import { Locale } from './config';



async function getLocale(): Promise<Locale> {
  // Par défaut, retourner 'fr' (ou votre locale par défaut)
  // La vraie locale sera gérée côté client
  return 'en';
}


export default getRequestConfig(async () => {
  const locale = await getLocale();
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});