"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, X, Check, Mail, ChevronDown, User, Fingerprint, Phone, MailIcon } from "lucide-react";
import { searchUser } from "@/actions/userAction";
import { IUser, IUserPermission, SeachUserParams } from "@/types/user";
import { useRouter } from "@bprogress/next/app";
import toast from "react-hot-toast";
import autoAnimate from "@formkit/auto-animate";
import ManagerCardSkeleton from "@/components/skeleton/ManagerCardSkeleton";
import Button from "@/components/ui/Button";
interface ManagerSearchProps {
  onClose: () => void;
  onSelect: (manager: {
    userInfo: IUser,
    permissions: string[];
  }) => void;
  permissionList: IUserPermission[];
}
export const ManagerSearch = ({
  onClose,
  onSelect,
  permissionList
}: ManagerSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManager, setSelectedManager] = useState<IUser>();
  const router = useRouter();
  const [step, setStep] = useState<"search" | "permissions" | "invite">("search");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [userList, setUserList] = useState<IUser[]>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [searchFilter, setSearchFilter] = useState<keyof typeof searchOptions>("firstName");


  useEffect(() => {
    init();
  }, [])

  
  const listRef = useRef(null);
  useEffect(() => {
    listRef.current && autoAnimate(listRef.current, { duration: 300 });
  }, []);
  
  const searchOptions = {
    firstName: "firstName",
    email: "Email",
    NIU: "NIU",
  };

  const handleManagerSelect = (manager: any) => {
    setSelectedManager(manager);
    setStep("permissions");
  };

  const handleFilterChange = (filter: keyof typeof searchOptions) => {
    console.log('-->filter', filter);
    setSearchFilter(filter);
  }
  
  const handleInvite = async () => {
    console.log("Inviting manager:", {
      manager: selectedManager,
      permissions: selectedPermissions,
    });
    onSelect({
      userInfo: selectedManager!,
      permissions: selectedPermissions,
    });
    setIsSendingEmail(true);
    onClose();
  };

  const hanlePermissionChange = async (e: string) => {
    if(selectedPermissions.includes(e)) {
      setSelectedPermissions(prevPermissionList => (prevPermissionList.filter(permission => permission !== e)));
    } else {
      setSelectedPermissions(prevPermissionList => [...prevPermissionList, e]);
    }
  }

  const filterManagers = (managers: IUser[]) => {
    if (!searchQuery) return managers;
    return managers.filter((manager) =>
      manager[searchFilter].toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };
  

  const init = async () => {
    try {
      setIsFetchingUsers(true);
      const params: SeachUserParams = {
        orderBy: 'U.Firstname',
        orderMode: 'asc',
        limit: 1000,
        offset: 0,
      }; 
      const result = await searchUser(params);
      let _userList: IUser[] = [];
      console.log("result", result);
      if(result.data) {
        if(result.data.body.count > 0){
          _userList = result.data.body.items.filter((user: any) => (user.RoleCode == "RENTER"))
          .map((user: any) => ({
            id: user.Code,
            profileId: "",
            firstName: user.user.Firstname,
            lastName: user.user.Lastname,
            email: user.user.Email,
            phone: user.user.Phone,
            profile: user.user.Profiles,
            gender: user.user.Gender,
            city: user.user.Address.City,
            street: user.user.Address.Street,
            country: user.user.Address.Country,
            avatarUrl: user.user.AvatarUrl,
            status: user.Status,
            NIU: user.user.NIU,
          }))
        }
        setUserList(_userList);
      }  else if(result.error){
        if(result.code == 'SESSION_EXPIRED'){
          router.push('/signin');
          return;
        }
        toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsFetchingUsers(false);
    }
  }
  return (
    <div className="rounded-lg w-full max-h-[75vh] min-h-[75vh] max-w-2xl mx-auto bg-white dark:bg-gray-800 flex flex-col">
      <div className="bg-white dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold dark:text-white">
          {step === "search" && "Find Property Manager"}
          {step === "permissions" && "Set Permissions"}
          {step === "invite" && "Send Invitation"}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <X size={20} className="dark:text-gray-400" />
        </button>
      </div>
      {step === "search" &&
        <div className="p-4 flex gap-2 border-b">
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
            <select 
              name="cars" 
              id="cars" 
              value={searchFilter}
              onChange={(e => handleFilterChange(e.target.value as keyof typeof searchOptions))}
              className="w-full py-2 min-w-25 pl-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="firstName">Name</option>
              <option value="email">Email</option>
              <option value="NIU">NIU</option>
            </select>
          </div>
          
        </div>
      }
      <div className="p-4 h-full flex-1 flex flex-col overflow-y-auto">
        {step === "search" && (
          <>
            
            <div className="space-y-4 bg-re"  ref={listRef}>
              {!isFetchingUsers ? 
                filterManagers(userList).slice(0, 10).map((manager) => <ManagerCard key={manager.id} manager={manager} handleManagerSelect={handleManagerSelect} />) :
                <div className="space-y-4">
                  <ManagerCardSkeleton />
                  <ManagerCardSkeleton />
                  <ManagerCardSkeleton />
                </div>
              }
            </div>
          </>
        )}
        {(step === "permissions" || step === "invite") && (
          <div className="gap-3 mt-6 relative flex flex-col flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {permissionList.length > 0 && permissionList.map((permission, index) => (
                <label key={index} className="block">
                  <input
                    type="checkbox"
                    value={permission.Code}
                    className="peer hidden"
                    onChange={(e) => hanlePermissionChange(e.target.value)}
                  />
                  <span className="flex items-center gap-2 p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer
                    peer-checked:bg-blue-100 peer-checked:text-gray-700 dark:peer-checked:bg-blue-950 dark:peer-checked:text-gray-200 peer-checked:border-blue-100 dark:peer-checked:border-blue-950">
                    {permission.Title}
                  </span>
                </label>
              ))}
            </div>

            <div className="absolute bottom-0 right-0 left-0 space-x-3 flex justify-end">
              <Button
                onClick={() => setStep("search")}
                isSubmitBtn={false}
                variant="outline-neutral"
                fullWidth={false}
              >
                Back
              </Button>
              <Button
                onClick={handleInvite}
                isSubmitBtn={false}
                variant="info"
                fullWidth={false}
                loading={isSendingEmail}
              >
                Send Invitation
              </Button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ManagerCard = ({manager, handleManagerSelect}: {manager: IUser, handleManagerSelect: (mng: IUser) => void}) => {
  return <div
    onClick={() => handleManagerSelect(manager)}
    className="group border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 hover:shadow-sm transition-all cursor-pointer hover:border-blue-500"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
        <User size={20} />
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white leading-snug">
          {manager.firstName} {manager.lastName}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Fingerprint size={14} /> ID: {manager.NIU}
        </p>
      </div>
    </div>

    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 pl-2.5">
      <p className="flex items-center gap-2">
        <MailIcon size={14} className="text-blue-500" />
        {manager.email}
      </p>
      <p className="flex items-center gap-2">
        <Phone size={14} className="text-green-500" />
        {manager.phone}
      </p>
    </div>
  </div>
}
