'use client';

import React, { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import SectionWrapper from '@/components/Cards/SectionWrapper';
import { ResponsiveTablePaginated } from '@/components/feature/Support/ResponsiveTablePaginated';
import Nodata from '@/components/error/Nodata';
import { SkeletonTable } from '@/components/skeleton/SkeletonTable';
import toast from 'react-hot-toast';
import { useRouter } from '@bprogress/next/app';
import { MANAGER_PROFILE_LIST } from '@/constant';
import { roleStore } from '@/store/roleStore';
import { useTranslations } from 'next-intl';
import { searchAsset } from '@/actions/assetAction';
import { AssetData, SeachPropertyParams } from '@/types/Property';
import { getSupportAssetListColumns } from '@/config/propertyTableColumns';

export default function SupportPropertyListPage() {
  const [assetList, setAssetList] = useState<AssetData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const router = useRouter();
  const { isAuthorized } = roleStore();
  const commonT = useTranslations('Common');
  const supportT = useTranslations('Support.propertyList');

  const columns = getSupportAssetListColumns(commonT);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => window.clearTimeout(id);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, pageSize]);

  useEffect(() => {
    let cancelled = false;

    const fetchAssets = async () => {
      try {
        setIsLoading(true);
        const params: SeachPropertyParams = {
          limit: pageSize,
          offset: (page - 1) * pageSize,
          term: debouncedSearchTerm,
          orderBy: 'createdAt',
          orderMode: 'asc',
        };
        const result = await searchAsset(params, undefined);
        if (cancelled) return;

        if (result.data?.body) {
          const body = result.data.body as { count?: number; items?: unknown[] };
          const items = (body.items ?? []) as any[];
          setTotalCount(typeof body.count === 'number' ? body.count : items.length);
          setAssetList(
            items.map((item: any) => ({
              Code: item.Code,
              Title: item.Title,
              Price: item.Price,
              Currency: item.Currency,
              CoverUrl: item.CoverUrl,
              StatusCode: item.StatusCode,
              IsActive: item.IsActive,
              TypeCode: item.TypeCode,
              IsVerified: item.IsVerified,
              Address: {
                Code: item.Address?.Code ?? '',
                City: item.Address?.City ?? '',
                Country: item.Address?.Country ?? '',
                Street: item.Address?.Street ?? '',
              },
            }))
          );
        } else if (result.error) {
          if (result.code === 'SESSION_EXPIRED') {
            router.push('/signin');
            return;
          }
          toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
        }
      } catch (error) {
        if (!cancelled) {
          console.log('Support.propertyList.fetchAssets.error', error);
          toast.error(commonT('somethingWentWrong'), { position: 'bottom-right' });
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setHasLoadedOnce(true);
        }
      }
    };

    fetchAssets();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, debouncedSearchTerm, commonT, router]);

  if (!isAuthorized(MANAGER_PROFILE_LIST)) {
    router.push('/unauthorized');
    return null;
  }

  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName={supportT('title')} />
      <div className="w-full">
        <SectionWrapper title={supportT('sectionTitle')} Icon={Building2}>
          {!hasLoadedOnce && isLoading ? (
            <SkeletonTable rows={6} />
          ) : totalCount === 0 && !debouncedSearchTerm.trim() ? (
            <Nodata message={commonT('nothingToDisplay')} />
          ) : (
            <ResponsiveTablePaginated<AssetData>
              columns={columns}
              data={assetList}
              keyField="Code"
              totalCount={totalCount}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 25, 50, 100]}
              searchEnabled
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              isLoading={isLoading}
            />
          )}
        </SectionWrapper>
      </div>
    </DefaultLayout>
  );
}
