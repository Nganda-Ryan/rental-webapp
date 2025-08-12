import React from 'react'

const PrincingCardSkeleton = () => {
  return (
    <div className="animate-pulse">
        {/* Ligne pour le titre */}
        <div className="flex items-center gap-2">
            <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Ligne pour le prix */}
        <div className="mt-1">
            <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
    </div>

  )
}

export default PrincingCardSkeleton