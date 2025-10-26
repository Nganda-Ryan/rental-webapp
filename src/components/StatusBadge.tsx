"use client"
import { useTranslations } from 'next-intl';
import { getStatusBadge } from '@/lib/utils-component';

interface StatusBadgeProps {
  status: string;
}

/**
 * StatusBadge - A wrapper component for getStatusBadge that automatically uses translations
 * This component can be used in React components to display translated status badges
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const t = useTranslations('Status');
  return <>{getStatusBadge(status, t)}</>;
};
