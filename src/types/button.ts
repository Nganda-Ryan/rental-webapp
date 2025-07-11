import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface ButtonProps {
    children: ReactNode;
    variant: Variant;
    disable?: boolean;
    onClick?: (e: any) => void;
    isSubmitBtn?: boolean;
    fullWidth?: boolean;
    loading?: boolean;
}

export const VARIANTS = {
    info: `
      bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100
      dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:focus:ring-blue-900 text-sm
    `,
    danger: `
      bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-100
      dark:bg-red-600 dark:text-white dark:hover:bg-red-700 dark:focus:ring-red-900 text-sm
    `,
    warning: `
      bg-yellow-400 text-black hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-100
      dark:bg-yellow-500 dark:text-black dark:hover:bg-yellow-600 dark:focus:ring-yellow-900 text-sm
    `,
    success: `
      bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-100
      dark:bg-green-600 dark:text-white dark:hover:bg-green-700 dark:focus:ring-green-900 text-sm
    `,
    neutral: `
      text-white bg-[#2A4365] hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 
      dark:bg-[#2A4365] dark:text-white dark:hover:bg-[#1A365D] dark:focus:ring-blue-800 transition-colors duration-150 text-sm
    `,
    'outline-info': `
      border border-blue-500 text-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100
      dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:focus:ring-blue-900
      px-2 py-1 rounded flex items-center gap-1 transition-colors duration-150 text-sm
    `,

    'outline-danger': `
      border border-red-500 text-red-500 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100
      dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20 dark:focus:ring-red-800
      px-2 py-1 rounded flex items-center gap-1 transition-colors duration-150 text-sm
    `,

    'outline-warning': `
      border border-yellow-500 text-yellow-600 hover:bg-yellow-50 focus:outline-none focus:ring-4 focus:ring-yellow-100
      dark:border-yellow-400 dark:text-yellow-300 dark:hover:bg-yellow-900/30 dark:focus:ring-yellow-900
      px-2 py-1 rounded flex items-center gap-1 transition-colors duration-150 text-sm
    `,

    'outline-success': `
      border border-green-500 text-green-500 hover:bg-green-50 focus:outline-none focus:ring-4 focus:ring-green-100
      dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/30 dark:focus:ring-green-900
      px-2 py-1 rounded flex items-center gap-1 transition-colors duration-150 text-sm
    `,

    'outline-neutral': `
      text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100
      dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700
      px-2 py-1 rounded flex items-center gap-1 transition-colors duration-150 text-sm
    `,

} as const;
  
  
export const VARIANTS_V1 = {
  info: `
    px-2 py-1.5 rounded-lg font-medium text-sm transition-colors duration-200
    bg-blue-100 text-blue-800 hover:bg-blue-200 active:bg-blue-300
    dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 dark:active:bg-blue-700
  `,
  danger: `
    px-2 py-1.5 rounded-lg font-medium text-sm transition-colors duration-200
    bg-red-100 text-red-800 hover:bg-red-200 active:bg-red-300
    dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800 dark:active:bg-red-700
  `,
  warning: `
    px-2 py-1.5 rounded-lg font-medium text-sm transition-colors duration-200
    bg-yellow-100 text-yellow-800 hover:bg-yellow-200 active:bg-yellow-300
    dark:bg-yellow-900 dark:text-yellow-100 dark:hover:bg-yellow-800 dark:active:bg-yellow-700
  `,
  success: `
    px-2 py-1.5 rounded-lg font-medium text-sm transition-colors duration-200
    bg-green-100 text-green-800 hover:bg-green-200 active:bg-green-300
    dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800 dark:active:bg-green-700
  `,
  neutral: `
    px-2 py-1.5 rounded-lg font-medium text-sm transition-colors duration-200
    bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300
    dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600
  `,
  'outline-info': `
    px-2 py-1.5 rounded-lg font-medium text-sm transition-colors duration-200
    border border-blue-300 text-blue-800 bg-white hover:bg-blue-50 active:bg-blue-100
    dark:border-blue-700 dark:text-blue-200 dark:bg-transparent dark:hover:bg-blue-800/20 dark:active:bg-blue-800/30
  `,
  'outline-danger': `
    px-2 py-1.5 rounded-lg font-medium text-sm transition-colors duration-200
    border border-red-300 text-red-800 bg-white hover:bg-red-50 active:bg-red-100
    dark:border-red-700 dark:text-red-200 dark:bg-transparent dark:hover:bg-red-800/20 dark:active:bg-red-800/30
  `,
  'outline-warning': `
    px-2 py-1.5 rounded-lg font-medium text-sm transition-colors duration-200
    border border-yellow-300 text-yellow-800 bg-white hover:bg-yellow-50 active:bg-yellow-100
    dark:border-yellow-700 dark:text-yellow-200 dark:bg-transparent dark:hover:bg-yellow-800/20 dark:active:bg-yellow-800/30
  `,
  'outline-success': `
    px-2 py-1.5 rounded-lg font-medium text-sm transition-colors duration-200
    border border-green-300 text-green-800 bg-white hover:bg-green-50 active:bg-green-100
    dark:border-green-700 dark:text-green-200 dark:bg-transparent dark:hover:bg-green-800/20 dark:active:bg-green-800/30
  `,
  'outline-neutral': `
    px-2 py-1.5 rounded-lg font-medium text-sm transition-colors duration-200
    border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 active:bg-gray-100
    dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600
  `,
} as const;

  
type Variant_1 = keyof typeof VARIANTS_V1;
type Variant = keyof typeof VARIANTS;