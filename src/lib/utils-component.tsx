import { CheckCircle, Clock, ExternalLink, XCircle } from "lucide-react"

export const getStatusBadge = (status: string) => {
  const baseClass =
    "w-fit flex items-center gap-1 px-2 py-1 rounded-full text-sm lowercase me-2 capitalize";

  const statusKey = status.toUpperCase();

  if (["DRAFT", "DRAFTING"].includes(statusKey)) {
    return (
      <div className={`${baseClass} bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400`}>
        <ExternalLink size={14} className="text-inherit" />
        <span>{status.toLowerCase()}</span>
      </div>
    );
  }

  if (["PENDING", "PENDING_APPROVAL"].includes(statusKey)) {
    return (
      <div className={`${baseClass} bg-yellow-100 text-yellow-600 dark:bg-gray-700 dark:text-yellow-400`}>
        <Clock size={14} className="text-inherit" />
        <span>{status.toLowerCase()}</span>
      </div>
    );
  }

  if (["APPROVED", "RENTED", "ACTIVE", "PAID", "AVAILABLE"].includes(statusKey)) {
    return (
      <div className={`${baseClass} bg-green-100 text-green-600 dark:bg-gray-700 dark:text-green-400`}>
        <CheckCircle size={14} className="text-inherit" />
        <span>{status.toLowerCase()}</span>
      </div>
    );
  }

  if (["CANCELED", "CANCEL", "REJECTED", "UNPAID", "INACTIVE"].includes(statusKey)) {
    return (
      <div className={`${baseClass} bg-red-100 text-red-600 dark:bg-gray-700 dark:text-red-400`}>
        <XCircle size={14} className="text-inherit" />
        <span>{status.toLowerCase()}</span>
      </div>
    );
  }

  // fallback
  return (
    <div className={`${baseClass} bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400`}>
      <ExternalLink size={14} className="text-inherit" />
      <span>{status.toLowerCase()}</span>
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
        <span className={`${baseClass} bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100`}>
          {role.toLowerCase()}
        </span>
      );
  }
};
