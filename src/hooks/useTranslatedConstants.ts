'use client';

import { useTranslations } from 'next-intl';

export const useTranslatedConstants = () => {
  const t = useTranslations('Common');

  // Client Profile Options
  const CLIENT_PROFILE_OBJ_LIST = [
    {
      label: t('allProfiles'),
      value: "ALL"
    },
    {
      label: t('lessor'),
      value: "LANDLORD"
    },
    {
      label: t('tenant'),
      value: "Renter"
    },
    {
      label: t('manager'),
      value: "MANAGER"
    }
  ];

  // Manager Profile Options
  const MANAGER_PROFILE_OBJ_LIST = [
    {
      label: t('admin'),
      value: "ADMIN"
    },
    {
      label: t('support'),
      value: "SUPPORT"
    }
  ];

  // Users Status Options
  const USERS_STATUS = [
    {
      label: t('allStatus'),
      value: "ALL"
    },
    {
      label: t('active'),
      value: "ACTIVE"
    },
    {
      label: t('pending'),
      value: "PENDING"
    },
    {
      label: t('inactive'),
      value: "INACTIVE"
    }
  ];

  // Property Type Options
  const PROPERTY_TYPE_OBJ_LIST = [
    {
      label: t('CPLXMOD'),
      value: "CPLXMOD"
    },
    {
      label: t('STUDMOD'),
      value: "STUDMOD"
    },
    {
      label: t('CHAMMOD'),
      value: "CHAMMOD"
    },
    {
      label: t('APPART'),
      value: "APPART"
    }
  ];

  const PROPERTY_TYPE_OBJ_CODE = PROPERTY_TYPE_OBJ_LIST;

  // Billing Item Type Options
  const BILLING_ITEM_TYPE_OBJ_LIST = [
    { label: t('WATER'), value: "WATER" },
    { label: t('ELEC'), value: "ELEC" },
    { label: t('INET01'), value: "INET01" },
    { label: t('GAS'), value: "GAS" },
    { label: t('RENT'), value: "RENT" },
    { label: t('SVCOLD'), value: "SVC-OLD" },
  ];

  return {
    CLIENT_PROFILE_OBJ_LIST,
    MANAGER_PROFILE_OBJ_LIST,
    USERS_STATUS,
    PROPERTY_TYPE_OBJ_LIST,
    PROPERTY_TYPE_OBJ_CODE,
    BILLING_ITEM_TYPE_OBJ_LIST
  };
};
