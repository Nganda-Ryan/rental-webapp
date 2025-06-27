import { Loader2 } from 'lucide-react'
import React from 'react'

const LoadingPage = () => {
    return (
       <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950 transition-colors">
      <div className="text-center space-y-4">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Loading in progress...
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Please wait a moment.
        </p>
      </div>
    </div>
    )
}

export default LoadingPage