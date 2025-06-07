import { CheckCircle, Clock, ExternalLink, XCircle } from "lucide-react"

export const getStatusIcon = (status: string) => {
    if(status.toUpperCase() == 'DRAFT' || status.toUpperCase() == 'DRAFTING'){
      return <div className="w-fit flex items-center justify-end flex-nowrap gap-1 px-2 py-1 bg-gray-100 rounded-xl text-gray-600 text-xs font-medium me-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-400">
        <span><ExternalLink size={15} className="text-gray-600 dark:text-gray-400" /></span>
        <span className='text-xs'>{status}</span>
      </div>
    } else if(status.toUpperCase() == 'PENDING' || status.toUpperCase() == 'PENDING_APPROVAL'){
      return <div className="w-fit flex items-center justify-end flex-nowrap gap-1 px-2 py-1 bg-yellow-100 rounded-xl text-yellow-600 text-xs font-medium me-2 dark:bg-gray-700 dark:text-yellow-400 border border-yellow-400">
        <span><Clock size={15} className="text-yellow-600 dark:text-yellow-400" /></span>
        <span className='text-xs'>{status}</span>
      </div>
    }
    else if (status.toUpperCase() == 'APPROVED' || status.toUpperCase() == 'APPROVED' || status.toUpperCase() == 'RENTED' || status.toUpperCase() == 'ACTIVE'){
      return <div className="w-fit flex items-center justify-end flex-nowrap gap-1 px-2 py-1 bg-green-100 rounded-xl text-green-600 text-xs font-medium me-2 dark:bg-gray-700 dark:text-green-400 border border-green-400">
        <span><CheckCircle size={15} className="text-green-600 dark:text-green-400" /></span>
        <span className='text-xs'>{status}</span>
      </div>
    } else if(status.toUpperCase() == 'CANCELED' || status.toUpperCase() == 'CANCEL' || status.toUpperCase() == 'REJECTED'){
      return <div className="w-fit flex items-center justify-end flex-nowrap gap-1 px-2 py-1 bg-red-100 rounded-xl text-red-600 text-xs font-medium me-2 dark:bg-gray-700 dark:text-red-400 border border-red-400">
        <span><XCircle size={15} className="text-red-600 dark:text-red-400" /></span>
        <span className='text-xs'>{status}</span>
      </div>
    }
    return <div className="w-fit flex items-center justify-end flex-nowrap gap-1 px-2 py-1 bg-gray-100 rounded-xl text-gray-600 text-xs font-medium me-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-400">
      <span><ExternalLink size={15} className="text-gray-600 dark:text-gray-400" /></span>
      <span className='text-xs'>{status}</span>
    </div>
}