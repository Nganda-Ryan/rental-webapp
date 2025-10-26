"use client"
import React from 'react';
import { UserCog } from "lucide-react";
import SectionWrapper from "@/components/Cards/SectionWrapper";
import Button from "@/components/ui/Button";
import { IManagerInfo, IUser } from "@/types/user";
import { getStatusBadge } from "@/lib/utils-component";
import { v4 as uuidv4 } from 'uuid';

interface PropertyManagerSectionProps {
  managerList: IManagerInfo[];
  onCancelInvitation?: (manager: IManagerInfo) => void;
}

export const PropertyManagerSection: React.FC<PropertyManagerSectionProps> = ({
  managerList,
  onCancelInvitation,
}) => {
  if (managerList.length === 0) return null;
  console.log('managerList', managerList)
  return (
    <SectionWrapper title="Manager" Icon={UserCog}>
      {managerList.map((manager) => (
        <div
          key={uuidv4()}
          className="border border-gray-100 dark:border-gray-700 rounded-lg p-4"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium dark:text-gray-300">
                {manager.Name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{manager.Email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{manager.Phone}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="flex flex-col items-center">
                {getStatusBadge(manager.Status)}
              </span>
            </div>
          </div>
          {manager.Permissions && manager.Permissions.length > 0 && (
            <div className="flex flex-wrap gap-4 py-4 border-t border-gray-100 dark:border-gray-700">
              {manager.Permissions.map((item) => (
                <span
                  key={item}
                  className="px-1.5 py-1.5 w-fit text-xs bg-gray-50 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-100"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
          {manager.Status === "PENDING" && onCancelInvitation && (
            <div className="flex gap-2">
              <Button
                onClick={() => onCancelInvitation(manager)}
                isSubmitBtn={false}
                variant="danger"
                fullWidth={false}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      ))}
    </SectionWrapper>
  );
};
