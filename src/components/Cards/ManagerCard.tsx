import { formatDateToText } from '@/lib/utils'
import { getStatusBadge } from '@/lib/utils-component'
import { IUser } from '@/types/user'
import React from 'react'

const ManagerCard = ({manager}: {manager: IUser}) => {
    return (
        <div className="border border-gray-100 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h4 className="font-medium dark:text-gray-300">{manager.lastName} {manager.firstName}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{manager.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{manager.phone}</p>
            </div>
            <div className="flex flex-col items-end">
                <span className="flex flex-col items-center">
                    {getStatusBadge(manager.status)}
                    {
                        manager.createdAt && <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatDateToText(manager.createdAt)}
                        </span>
                    }
                </span>
            </div>
        </div>
        {
            (manager.permissions && manager.permissions.length > 0) && <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                {
                    manager.permissions.map((item) => (
                    <span key={item} className="px-1.5 py-1.5 w-fit text-xs bg-gray-50 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-100">
                        {item}
                    </span>))
                }
            </div>
        }
        {/* { 
            manager.status =="PENDING" && <div className="flex gap-2">
                <Button
                    onClick={() => {handleCancelManagerInvitation(manager)}}
                    isSubmitBtn={false}
                    variant="danger"
                    fullWidth={false}
                >
                    Cancel
                </Button>
            </div>
        } */}
        </div>
    )
}

export default ManagerCard