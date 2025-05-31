"use client"
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

export const Dropdown = ({
  open = false,
  children,
  title,
  index,
  handleDelete,
  onToggle,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  handleDelete?: (index: number) => void;
  onToggle?: () => void;
  index: number;
}) => {
  return (
    <div className="relative">
      <div
        data-testid="dropdown-header"
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle?.();
          }
        }}
        className={`flex items-center justify-between px-4 h-9 font-bold select-none cursor-pointer 
          bg-indigo-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-t 
          ${open && "bg-indigo-100 dark:bg-gray-700 transition-all duration-[0.20s]"}`}
      >
        <div className="flex flex-wrap flex-col sm:flex-row text-sm">
          {title}
        </div>
        <div className="flex items-center justify-end gap-4">
          <Image
            src="/images/icon/icon-arrow-down.svg"
            alt="chevron down"
            height={20}
            width={20}
            className={`${open && "rotate-180 transition-all duration-[0.20s]"}`}
          />
          {handleDelete && (
            <div
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Pour éviter de déclencher onToggle
                handleDelete(index);
              }}
              aria-label="Delete"
            >
              <Trash2 size={18} color="red" />
            </div>
          )}
        </div>
      </div>


      <hr className="h-px rounded bg-indigo-200 border-0 mx-auto" />

      {/* Contenu déroulant */}
      <div
        className={`rounded px-2 text-sm overflow-hidden transition-all duration-[0.20s] text-slate-800 ${
          open ? "max-h-[600px] py-4" : "max-h-0 py-0"
        }`}
      >
        <div className="poppins-font text-sm">{children}</div>
      </div>
    </div>
  );
};
