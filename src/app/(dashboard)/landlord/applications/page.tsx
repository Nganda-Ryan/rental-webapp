'use client';

import React, { useEffect, useState, useCallback, useRef } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { searchRequest } from "@/actions/requestAction";
import { SearchRequest } from "@/types/rentalRequest";
import { useRouter } from "@bprogress/next/app";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import RentalRequestCard from "@/components/Cards/RentalRequestCard";
import Nodata from "@/components/error/Nodata";
import ApplicationCardSkeleton from "@/components/skeleton/ApplicationCardSkeleton";
import { IApplication } from "@/types/requestTypes";
import { Search } from "lucide-react";
import autoAnimate from "@formkit/auto-animate";

const ITEMS_PER_PAGE = 9; // 3 columns × 3 rows

export default function ApplicationsPage() {
  const router = useRouter();
  const t = useTranslations("Common");
  const navT = useTranslations("Navigation");
  const tableT = useTranslations("Table");
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const listRef = useRef(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      
      const params: SearchRequest = {
        type: 'APPLICATION',
        orderBy: 'CreatedAt',
        orderMode: 'desc',
        limit: ITEMS_PER_PAGE.toString(),
        offset: offset.toString(),
        page: currentPage.toString(),
        term: debouncedSearchTerm.trim() || undefined,
      };
      
      console.log('-->searchRequest params', params);
      const result = await searchRequest(params);
      console.log('-->searchRequest result', result);
      
      if (result.data && result.data.body) {
        const items = result.data.body.items || [];
        const count = result.data.body.count || 0;
        
        // Convert API response to IApplication format
        const mappedApplications: IApplication[] = items.map((item: any) => ({
          Code: item.Code,
          TypeCode: item.TypeCode,
          CreatedAt: item.CreatedAt,
          SubmittedDate: item.SubmittedDate,
          ClosedDate: item.ClosedDate,
          IsClosed: item.IsClosed,
          StatusCode: item.StatusCode,
          Description: item.Description,
          LevelCode: item.LevelCode,
          renter: {
            Code: item.creator.user.Code,
            Status: item.creator.user.Status,
            RoleCode: item.creator.RoleCode,
            CreatedAt: item.creator.CreatedAt,
            IsActive: item.creator.IsActive,
            UserCode: item.creator.UserCode,
            Email: item.creator.user.Email,
            Firstname: item.creator.user.Firstname,
            Gender: item.creator.user.Gender,
            Lastname: item.creator.user.Lastname,
            NIU: item.creator.user.NIU || '',
            Phone: item.creator.user.Phone,
            AvatarUrl: item.creator.user.AvatarUrl || '',
          }
        }));
        
        setApplications(mappedApplications);
        setTotalCount(count);
      } else if (result.error) {
        if (result.code === 'SESSION_EXPIRED') {
          router.push('/signin');
          return;
        }
        toast.error(result.error ?? t('unexpectedError'), { position: 'bottom-right' });
      }
    } catch (error) {
      console.error('-->searchRequest error', error);
      toast.error(t('unexpectedError'), { position: 'bottom-right' });
    } finally {
      setIsLoading(false);
    }
  }, [router, t, currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchApplications();
    listRef.current && autoAnimate(listRef.current, { duration: 300 });
  }, [fetchApplications]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <DefaultLayout>
      <Breadcrumb pageName={navT('applicationsReceived')} />

      <div className="w-full">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder={tableT('searchPlaceholder')}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <ApplicationCardSkeleton key={index} />
            ))}
          </div>
        ) : applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" ref={listRef}>
            {applications.map((application) => (
              <RentalRequestCard key={application.Code} data={application} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 w-96 mx-auto">
            <Nodata  />
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tableT('previous')}
            </button>
            <span className="text-gray-700 dark:text-gray-200">
              {tableT('page', { page: currentPage, totalPages })}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tableT('next')}
            </button>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
