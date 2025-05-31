import React from "react";
import {
  Mail,
  Phone,
  FileText,
  MessageSquare,
  History,
  MoreVertical,
} from "lucide-react";
interface TenantCardProps {
  tenant: {
    name: string;
    email: string;
    phone: string;
    unit: string;
    moveIn: string;
    status: string;
    rent: string;
  };
  onAction: (action: string) => void;
  isDropdownOpen: boolean;
  onToggleDropdown: () => void;
}
export const TenantCard = ({
  tenant,
  onAction,
  isDropdownOpen,
  onToggleDropdown,
}: TenantCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium text-gray-900">{tenant.name}</h3>
          <p className="text-sm text-gray-500">{tenant.unit}</p>
        </div>
        <div className="relative">
          <button
            onClick={onToggleDropdown}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <MoreVertical size={20} className="text-gray-400" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => onAction("rental")}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <FileText size={16} />
                Create Rental
              </button>
              <button
                onClick={() => onAction("message")}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <MessageSquare size={16} />
                Send Message
              </button>
              <button
                onClick={() => onAction("history")}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <History size={16} />
                Payment History
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Mail size={14} />
          {tenant.email}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Phone size={14} />
          {tenant.phone}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${tenant.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {tenant.status}
          </span>
          <span className="text-sm text-gray-500">Since {tenant.moveIn}</span>
        </div>
        <span className="font-medium text-gray-900">{tenant.rent}</span>
      </div>
    </div>
  );
};
