import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface ButtonProps {
    children: ReactNode;
    variant: Variant;
    disable: boolean;
    onClick?: (e: any) => void;
    isSubmitBtn: boolean;
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
  
  
  
  
type Variant = keyof typeof VARIANTS;