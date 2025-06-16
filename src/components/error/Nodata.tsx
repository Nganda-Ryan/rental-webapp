import React from 'react'

const Nodata = ({message}: {message?: string}) => {
  return (
    <div className="h-[50vh] flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm pt-3">
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="96"
        height="96"
        fill="none"
        viewBox="0 0 64 64"
        className="w-14 sm:w-24 h-14 sm:h-24 mb-4"
        >
        <rect x="8" y="8" width="48" height="48" rx="8" fill="#E5E7EB" className="dark:fill-gray-700" />
        <path
            d="M22 22h20v4H22zM22 30h14v4H22z"
            fill="#9CA3AF"
            className="dark:fill-gray-400"
        />
        <circle
            cx="42"
            cy="42"
            r="6"
            stroke="#9CA3AF"
            strokeWidth="2"
            className="dark:stroke-gray-400"
        />
        <line
            x1="46"
            y1="46"
            x2="52"
            y2="52"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
        />
        </svg>
        <p className="text-sm sm:text-lg">{message ?? "Nothing to display"}</p>
    </div>
  )
}

export default Nodata