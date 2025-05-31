"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  BadgeCheck,
  Building,
  Building2,
  Home,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import SidebarItemSkeleton from "../skeleton/SidebarItemSkeleton";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";


type MenuItem = {
  icon: React.ReactNode;
  label: string;
  route: string;
  profiles: string[];
};

type MenuGroup = {
  name: string;
  menuItems: MenuItem[];
};


const ALL_MENU_GROUPS = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <LayoutDashboard size={20} />,
        label: "Dashboard",
        route: "/tenants",
        profiles: ["RENTER"],
      },
      {
        icon: <Building2 size={20} />,
        label: "My Listing",
        route: "/tenants/mylisting",
        profiles: ["RENTER"],
      },
      {
        icon: <Home size={20} />,
        label: "Housing application",
        route: "/tenants/housing-application",
        profiles: ["RENTER"],
      },
      {
        icon: <LayoutDashboard size={20} />,
        label: "Dashboard",
        route: "/landlord",
        profiles: ["LANDLORD"],
      },
      {
        icon: <Building size={20} />,
        label: "Properties",
        route: "/landlord/properties",
        profiles: ["LANDLORD"],
      },
      {
        icon: <Users size={20} />,
        label: "Tenants",
        route: "/tenants",
        profiles: ["LANDLORD"],
      },
      {
        icon: <LayoutDashboard size={20} />,
        label: "System Overview",
        route: "/support",
        profiles: ["SUPPORT", "ADMIN"],
      },
      {
        icon: <UserCog size={20} />,
        label: "Account Management",
        route: "/support/account-management",
        profiles: ["SUPPORT", "ADMIN"],
      },
      {
        icon: <BadgeCheck size={20} />,
        label: "Landlord Verification",
        route: "/support/landlord-verification",
        profiles: ["SUPPORT", "ADMIN"],
      },
      {
        icon: <Building2 size={20} />,
        label: "Properties Verification",
        route: "/support/properties-verification",
        profiles: ["SUPPORT", "ADMIN"],
      },
      {
        icon: <ShieldCheck size={20} />,
        label: "Support Users",
        route: "/support/support-users",
        profiles: ["ADMIN"],
      },
      {
        icon: <Settings size={20} />,
        label: "Settings",
        route: "/settings",
        profiles: ["RENTER", "MANAGER", "LANDLORD", "SUPPORT", "ADMIN"],
      },
    ],
  },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);

  const [isReady, setIsReady] = useState(false);
  const auth = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth.activeProfile) return;
    console.log('-->Sidebar.auth.profileList', auth.profileList);
    console.log('-->Sidebar.auth.activeProfile', auth.activeProfile);

    const filtered = ALL_MENU_GROUPS.map((group) => {
      const menuItems = group.menuItems.filter((item) =>
        item.profiles.includes(auth.activeProfile)
      );
      return {
        ...group,
        menuItems,
      };
    }).filter((group) => group.menuItems.length > 0);

    setMenuGroups(filtered);
    setIsReady(true);
  }, [auth.activeProfile]);

  const isActive = (item: any) => {
    if (pathname === item.route) return true;
    if (pathname.startsWith(item.route + "/")) {
      for (const group of menuGroups) {
        for (const menuItem of group.menuItems) {
          if (
            menuItem.route !== item.route &&
            pathname.startsWith(menuItem.route) &&
            item.route.length < menuItem.route.length
          ) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  };

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark xl:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/">
            <Image
              width={50}
              height={50}
              src={"/images/logo/logo-git-avatar.png"}
              alt="Logo"
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              />
            </svg>
          </button>
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {!isReady ? (
              <div role="status">
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  MENU
                </h3>
                <div className="flex items-center justify-center">
                  <SidebarItemSkeleton />
                </div>
              </div>
            ) : (
              menuGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                    {group.name}
                  </h3>
                  <ul className="mb-6 flex flex-col gap-1.5">
                    {group.menuItems.map((menuItem, menuIndex) => (
                      <SidebarItem
                        key={menuIndex}
                        item={menuItem}
                        pageName={pageName}
                        setPageName={setPageName}
                        isItemActive={isActive(menuItem)}
                      />
                    ))}
                  </ul>
                </div>
              ))
            )}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
