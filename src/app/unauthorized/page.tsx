import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function UnauthorizedPage() {
  const t = await getTranslations('Auth');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center px-6 py-12 text-center transition-colors duration-300">
      <div className="max-w-md">
        <div className="mb-6">
          <ShieldAlert className="w-20 h-20 text-red-600 dark:text-red-400 mx-auto" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          {t('accessDenied')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
          {t('noPermissions')}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          {t('backToHome')}
        </Link>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {t('contactAdmin')}
        </p>
      </div>
    </div>
  );
}
