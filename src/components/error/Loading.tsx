import React from 'react';

const Loading = ({ message }: { message?: string }) => {
  return (
    <div className="h-[35vh] flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm pt-3">
      <svg
        className="animate-spin w-14 sm:w-24 h-14 sm:h-24 mb-4 text-gray-400 dark:text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <p className="text-sm sm:text-lg">{message ?? "Loading data..."}</p>
    </div>
  );
};

export default Loading;
