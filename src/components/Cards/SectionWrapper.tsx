import { SectionWrapperProps } from '@/types/cards'
import React from 'react'



const SectionWrapper = ({children, Icon, title}: SectionWrapperProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-4">
            {Icon && <Icon size={20} className="text-gray-400" />}
            <h3 className="font-medium text-lg">{title}</h3>
        </div>
        <div className="space-y-4">
            { children }
        </div>
    </div>
  )
}

export default SectionWrapper