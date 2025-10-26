import { AssetTypeCode } from "@/types/Property";
import { CheckCircle, Clock, ExternalLink, XCircle } from "lucide-react"
import {
  DollarSign,
  Euro,
  IndianRupee,
  PoundSterling,
  SwissFranc,
  Banknote,
} from 'lucide-react';

interface Props {
  code:
    | 'DOLLAR'
    | 'EURO'
    | 'INR'
    | 'GBP'
    | 'RUB'
    | 'JPY'
    | 'CHF'
    | 'FCFA'
    | string; // pour capturer les cas inconnus
  size?: number;
  color?: string;
}

type TranslateFunction = (key: string) => string;

export const getStatusBadge = (status: string, t?: TranslateFunction) => {
  const baseClass =
    "w-fit flex items-center gap-1 px-2 py-0.5 rounded-full text-sm lowercase me-2 capitalize";

  const statusKey = status.toUpperCase();
  const statusLowerKey = status.toLowerCase().replace(/_/g, '_');

  // Use translation if provided, otherwise fallback to status.toLowerCase()
  const displayText = t ? (t(statusLowerKey) || status.toLowerCase()) : status.toLowerCase();

  if (["DRAFT", "DRAFTING"].includes(statusKey)) {
    return (
      <div className={`${baseClass} bg-gray-100 text-gray-600 dark:bg-gray-700/20 dark:text-gray-400`}>
        <ExternalLink size={14} className="text-inherit" />
        <span>{displayText}</span>
      </div>
    );
  }

  if (["PENDING", "PENDING_APPROVAL"].includes(statusKey)) {
    return (
      <div className={`${baseClass} bg-yellow-100 text-yellow-600 dark:bg-gray-700/20 dark:text-yellow-400`}>
        <Clock size={14} className="text-inherit" />
        <span>{displayText}</span>
      </div>
    );
  }

  if (["APPROVED", "RENTED", "ACTIVE", "PAID"].includes(statusKey)) {
    return (
      <div className={`${baseClass} bg-green-100 text-green-600 dark:bg-gray-700/20 dark:text-green-400`}>
        <CheckCircle size={14} className="text-inherit" />
        <span>{displayText}</span>
      </div>
    );
  }

    if (["AVAILABLE"].includes(statusKey)) {
    return (
      <div className={`${baseClass} bg-blue-100 text-blue-600 dark:bg-gray-700/20 dark:text-blue-400`}>
        <CheckCircle size={14} className="text-inherit" />
        <span>{displayText}</span>
      </div>
    );
  }

  if (["CANCELED", "CANCEL", "REJECTED", "UNPAID", "INACTIVE"].includes(statusKey)) {
    return (
      <div className={`${baseClass} bg-red-100 text-red-600 dark:bg-gray-700/20 dark:text-red-400`}>
        <XCircle size={14} className="text-inherit" />
        <span>{displayText}</span>
      </div>
    );
  }

  // fallback
  return (
    <div className={`${baseClass} bg-gray-100 text-gray-600 dark:bg-gray-700/20 dark:text-gray-400`}>
      <ExternalLink size={14} className="text-inherit" />
      <span>{displayText}</span>
    </div>
  );
};



export const getRoleBadge = (role: string) => {
  const baseClass = "py-1 px-2 rounded-xl text-sm capitalize";

  switch (role.toUpperCase()) {
    case "ADMIN":
      return (
        <span className={`${baseClass} bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100`}>
          {role.toLowerCase()}
        </span>
      );

    case "SUPPORT":
      return (
        <span className={`${baseClass} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`}>
          {role.toLowerCase()}
        </span>
      );

    case "MANAGER":
      return (
        <span className={`${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100`}>
          {role.toLowerCase()}
        </span>
      );

    case "LANDLORD":
      return (
        <span className={`${baseClass} bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100`}>
          {role.toLowerCase()}
        </span>
      );

    case "RENTER":
      return (
        <span className={`${baseClass} bg-blue-100 text-blue-800 dark:text-blue-800`}>
          {role.toLowerCase()}
        </span>
      );

    default:
      return (
        <span className={`${baseClass} bg-gray-200 text-gray-800 dark:bg-gray-700/20 dark:text-gray-100`}>
          {role.toLowerCase()}
        </span>
      );
  }
};

export const getCurrencyIcon = (code: string, size = 16, className = "") => {
  const currency = code.toUpperCase();

  if (["USD", "DOLLAR"].includes(currency)) {
    return <DollarSign size={size} className={className} />;
  }

  if (["EUR", "EURO"].includes(currency)) {
    return <Euro size={size} className={className} />;
  }

  if (["INR", "RUPEE"].includes(currency)) {
    return <IndianRupee size={size} className={className} />;
  }

  if (["GBP", "POUND"].includes(currency)) {
    return <PoundSterling size={size} className={className} />;
  }

  if (["CHF", "FRANC"].includes(currency)) {
    return <SwissFranc size={size} className={className} />;
  }

  if (["FCFA", "XAF", "XOF"].includes(currency)) {
    return <Banknote size={size} className={className} />;
  }

  // Fallback icon
  return <Banknote size={size} className={className} />;
};