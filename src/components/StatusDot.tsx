import React from "react";

interface Props {
  status: string;
}

const STATUS_COLOR: Record<string, string> = {
  DRAFT: "bg-gray-400",
  DRAFTING: "bg-gray-400",
  PENDING: "bg-yellow-400",
  PENDING_APPROVAL: "bg-yellow-400",
  APPROVED: "bg-green-500",
  RENTED: "bg-green-500",
  ACTIVE: "bg-green-500",
  PAID: "bg-green-500",
  AVAILABLE: "bg-blue-500",
  CANCELED: "bg-red-500",
  CANCEL: "bg-red-500",
  REJECTED: "bg-red-500",
  UNPAID: "bg-red-500",
  INACTIVE: "bg-red-500",
};

export const StatusDot: React.FC<Props> = ({ status }) => {
  const statusKey = status.toUpperCase();
  const colorClass = STATUS_COLOR[statusKey] ?? "bg-gray-400";

  return <div className={`w-2 h-2 rounded-full ${colorClass} mr-3`}></div>;
};
