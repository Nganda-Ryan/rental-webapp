import React, { useState } from "react";
import { Calendar, Lock, CheckCircle } from "lucide-react";
import Image from "next/image";
import { formatDateToText, formatPrice } from "@/lib/utils";
import { ILoan } from "@/types/Property";

const TenantAssetCard = ({
  loan,
  handleClick,
  className = "",
}: {
  loan: ILoan;
  handleClick: (loan: ILoan) => void;
  className?: string;
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { Amount, CoverUrl, Currency, EndDate, StartDate, Title } = loan;


  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-lg dark:border-gray-700 dark:bg-boxdark transition-all max-w-lg w-full cursor-pointer ${className}`}
      onClick={() => handleClick(loan)}
    >
      {/* Badge Statut */}
      {/* {status === "RENTED" && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs font-semibold shadow-sm dark:bg-yellow-900/30 dark:text-yellow-300">
          <Lock size={14} /> Loué
        </div>
      )}

      {status === "AVAILABLE" && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-semibold shadow-sm dark:bg-blue-900/30 dark:text-blue-300">
          <CheckCircle size={14} /> Disponible
        </div>
      )} */}

      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        <Image
            src={CoverUrl}
            alt={Title}
            width={800}
            height={600}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setIsImageLoading(false)}
            priority
          />
      </div>

      {/* Contenu */}
      <div className="py-4 px-3">
        {/* Titre */}
        <h3 className="mb-1 text-md font-semibold text-gray-900 truncate dark:text-white">
          {Title || "Titre non défini"}
        </h3>

        {/* Propriétaire */}
        {/* <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          Lessor : {owner?.firstName} {owner?.lastname}
        </p> */}

        {/* Dates */}
        <div className="mb-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Calendar className="mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
          {formatDateToText(StartDate)} — {formatDateToText(EndDate)}
        </div>

        {/* Bas de la carte */}
        <div className="flex items-center justify-between mt-3">
          <div className="font-bold text-gray-900 dark:text-white">
            {formatPrice(Amount)} {Currency}
            <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">/mois</span>
          </div>

          <div className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-300 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-700">
            Voir détails
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantAssetCard;
