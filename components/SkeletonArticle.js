"use client"

const SkeletonArticle = () => {
  return (
    <article className="flex flex-col mb-3 w-full mx-auto bg-white dark:bg-darkgrey border p-3 rounded-xl shadow-sm animate-pulse">
      {/* Header Skeleton */}
      <header className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6 p-1">
        <div className="flex items-center space-x-2">
          <div className="rounded-full border-mainColor bg-gray-300 dark:bg-gray-700 w-10 h-10 animate-pulse"></div>
          <div className="flex flex-col w-24 h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="w-20 h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </header>

      {/* Title and Description Skeleton */}
      <div className="w-full h-8 bg-gray-300 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
      <div className="w-full h-12 bg-gray-300 dark:bg-gray-700 rounded mb-6 animate-pulse"></div>

      {/* Image Skeleton */}
      <div className="w-full border-mainColor h-60 md:max-w-[95%] lg:h-[350px] relative rounded-xl overflow-hidden bg-gray-300 dark:bg-gray-700 animate-pulse"></div>

      {/* Action Buttons Skeleton */}
      <div className="flex items-center justify-between space-x-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-full w-24 h-10 animate-pulse"></div>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full w-10 h-10 animate-pulse"></div>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full w-10 h-10 animate-pulse"></div>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full w-10 h-10 animate-pulse"></div>
        </div>
        <div className="w-20 h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Footer Skeleton */}
      <footer className="flex items-center justify-between mt-4 gap-3">
        <div className="w-full sm:w-auto p-3 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
      </footer>
    </article>
  )
}

export default SkeletonArticle

