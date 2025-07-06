import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? '.' + parts.pop()! : '';
}

export function formatDateToText(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function capitalize(str: string): string {
  if(!str) return str
  const trimmed = str.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export function capitalizeEachWord(str: string): string {
  if(!str) return str
  return str
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function toUpperCase(str: string): string {
  if(!str) return str
  return str.trim().toUpperCase();
}


export function formatNumberWithSpaces(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};