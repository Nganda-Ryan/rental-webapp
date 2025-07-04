
const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded ${className}`} />
)

const ContractDetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mt-10">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <SkeletonBox className="h-6 w-40 mb-2" />
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">

                <SkeletonBox className="h-4 w-32" />
              </div>
            </div>
            <SkeletonBox className="h-6 w-24 rounded-full" />
          </div>

          {/* Financial Info */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
            <h3 className="font-medium mb-4 flex items-center gap-2 dark:text-white">

              <SkeletonBox className="h-4 w-50 mb-1" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <SkeletonBox className="h-4 w-24 mb-2" />
                <SkeletonBox className="h-6 w-28" />
              </div>
            </div>
            <div className="space-y-2">
              <SkeletonBox className="h-4 w-32 mb-2" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <SkeletonBox key={i} className="h-6 w-20 rounded px-2" />
                ))}
              </div>
            </div>
          </div>

          {/* Tenant Info */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
            <h3 className="font-medium mb-4 flex items-center gap-2 dark:text-white">

              <SkeletonBox className="h-4 w-50 mb-1" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <SkeletonBox className="h-4 w-16 mb-1" />
                <SkeletonBox className="h-5 w-28" />
              </div>
              <div>
                <SkeletonBox className="h-4 w-16 mb-1" />
                <div className="flex items-center gap-2">

                  <SkeletonBox className="h-4 w-24" />
                </div>
              </div>
              <div>
                <SkeletonBox className="h-4 w-16 mb-1" />
                <div className="flex items-center gap-2">

                  <SkeletonBox className="h-4 w-40" />
                </div>
              </div>
              <div>
                <SkeletonBox className="h-4 w-24 mb-1" />
                <div className="flex items-center gap-2">

                  <SkeletonBox className="h-4 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right section (actions or invoice generator) */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 h-36">
          <SkeletonBox className="h-6 w-40 mb-4" />
          <SkeletonBox className="h-8 w-full mb-2" />
          <SkeletonBox className="h-8 w-full mb-2" />
          {/* <SkeletonBox className="h-6 w-full mb-2" /> */}
        </div>
      </div>
    </div>
  );
}

export default ContractDetailSkeleton;