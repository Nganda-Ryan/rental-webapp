const SidebarItemSkeleton = () => {
    return (
      <>
        <div className="group relative flex flex-col items-center gap-6 rounded-sm px-4 py-2 ">
          <div className="h-5 w-50 rounded bg-gray-700 animate-pulse"></div>
          <div className="h-5 w-50 rounded bg-gray-700 animate-pulse"></div>
          <div className="h-5 w-50 rounded bg-gray-700 animate-pulse"></div>
        </div>
      </>
    );
};

export default SidebarItemSkeleton;
  