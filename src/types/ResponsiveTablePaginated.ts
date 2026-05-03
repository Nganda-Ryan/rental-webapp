import type { ReactNode } from 'react';

export interface ResponsiveTablePaginatedColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
  priority?: 'high' | 'medium' | 'low';
}

export interface ResponsiveTablePaginatedProps<T> {
  columns: ResponsiveTablePaginatedColumn[];
  data: T[];
  keyField: keyof T & string;
  onRowClick?: (row: T) => void;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  /** Si défini, affiche un select pour choisir le nombre de lignes par page (pagination serveur). */
  onPageSizeChange?: (pageSize: number) => void;
  /** Valeurs proposées pour le select « lignes par page » (défaut : 10, 25, 50, 100). */
  pageSizeOptions?: number[];
  searchEnabled?: boolean;
  searchTerm?: string;
  onSearchTermChange?: (term: string) => void;
  isLoading?: boolean;
}
