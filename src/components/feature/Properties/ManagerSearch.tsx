import React, { useState } from "react";
import { Search, X, Check, Mail, ChevronDown } from "lucide-react";
interface Permission {
  id: string;
  name: string;
  description: string;
}
interface ManagerSearchProps {
  onClose: () => void;
  onSelect: (manager: any) => void;
}
export const ManagerSearch = ({
  onClose,
  onSelect,
}: ManagerSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [step, setStep] = useState<"search" | "permissions" | "invite">(
    "search",
  );
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [searchFilter, setSearchFilter] = useState<keyof typeof searchOptions>("name");
  const [isSearchFilterOpen, setIsSearchFilterOpen] = useState(false);
  const permissions: Permission[] = [
    {
      id: "manage_tenants",
      name: "Manage Tenants",
      description: "Can add, edit, and remove tenants",
    },
    {
      id: "manage_maintenance",
      name: "Manage Maintenance",
      description: "Can create and handle maintenance requests",
    },
    {
      id: "view_finances",
      name: "View Finances",
      description: "Can view financial reports and transactions",
    },
    {
      id: "manage_leases",
      name: "Manage Leases",
      description: "Can create and modify lease agreements",
    },
  ];
  const managers = [
    {
      id: "MGR001",
      name: "David Wilson",
      email: "david.w@management.com",
      phone: "(555) 234-5678",
      properties: 12,
      rating: 4.8,
    },
    {
      id: "MGR002",
      name: "Emma Thompson",
      email: "emma.t@management.com",
      phone: "(555) 345-6789",
      properties: 8,
      rating: 4.9,
    },
  ];
  const searchOptions = {
    id: "Manager ID",
    name: "Name",
    email: "Email",
    phone: "Phone Number",
  };
  const handleManagerSelect = (manager: any) => {
    setSelectedManager(manager);
    setStep("permissions");
  };
  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };
  const handleInvite = async () => {
    console.log("Inviting manager:", {
      manager: selectedManager || {
        email: inviteEmail,
      },
      permissions: selectedPermissions,
    });
    onSelect({
      ...selectedManager,
      permissions: selectedPermissions,
    });
    onClose();
  };
  const filterManagers = (managers: any[]) => {
    if (!searchQuery) return managers;
    return managers.filter((manager) =>
      manager[searchFilter].toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[75vh] overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold dark:text-white">
            {step === "search" && "Find Property Manager"}
            {step === "permissions" && "Set Permissions"}
            {step === "invite" && "Send Invitation"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="dark:text-gray-400" />
          </button>
        </div>
        <div className="p-4">
          {step === "search" && (
            <>
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder={`Search by ${searchOptions[searchFilter]}...`}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsSearchFilterOpen(!isSearchFilterOpen)}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {searchOptions[searchFilter]}
                    <ChevronDown size={16} />
                  </button>
                  {isSearchFilterOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1">
                      {Object.entries(searchOptions).map(([key, value]) => (
                        <button
                          key={key}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => {
                            setSearchFilter(key as keyof typeof searchOptions);
                            setIsSearchFilterOpen(false);
                          }}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium dark:text-gray-300">
                    Available Managers
                  </h3>
                  <button
                    onClick={() => setStep("invite")}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800"
                  >
                    Invite New Manager
                  </button>
                </div>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {filterManagers(managers).map((manager) => (
                  <div
                    key={manager.id}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-500 cursor-pointer"
                    onClick={() => handleManagerSelect(manager)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium dark:text-white">
                          {manager.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ID: {manager.id}
                        </p>
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm">
                        {manager.rating} ★
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{manager.email}</p>
                      <p>{manager.phone}</p>
                      <p className="text-sm text-gray-500">
                        Managing {manager.properties} properties
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {(step === "permissions" || step === "invite") && (
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setStep("search")}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={handleInvite}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={
                  step === "invite"
                    ? !inviteEmail || selectedPermissions.length === 0
                    : selectedPermissions.length === 0
                }
              >
                Send Invitation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
