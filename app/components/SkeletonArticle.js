"use client";

import { Clock3, ArrowBigUp, ArrowBigDown, Share2, MessageCircle, MoreHorizontal } from "lucide-react";

const ArticleSkeleton = () => {
  return (
    <article className="flex w-full m-1 flex-col lg:flex-row bg-lightgrey dark:bg-darkgrey border p-4 max-w-4xl mx-auto rounded-xl shadow-sm animate-pulse">
      <div className="flex flex-col lg:flex-row items-center space-y-1 lg:space-y-0 lg:space-x-6 w-full">
        <div className="w-full border-mainColor h-60 md:max-w-[95%] lg:h-[350px] relative rounded-xl overflow-hidden mb-2 lg:mb-0 bg-gray-300 dark:bg-gray-700"></div>
        <div className="flex flex-col justify-between w-full">
          <header className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2 p-1">
            <div className="flex items-center space-x-2">
              <div className="rounded-full border-mainColor bg-gray-300 dark:bg-gray-700 w-10 h-10"></div>
              <div className="flex flex-col w-24 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="w-20 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </header>
          
          <div className="w-3/4 h-8 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
          <div className="w-full h-12 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
          
          <div className="flex items-center justify-between space-x-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-full w-24 h-10"></div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full w-10 h-10"></div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full w-10 h-10"></div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full w-10 h-10"></div>
            </div>
            <div className="w-20 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
          
          <footer className="flex items-center justify-between mt-4 gap-3">
            <div className="w-full sm:w-auto p-3 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </footer>
        </div>
      </div>
    </article>
  );
};

export default ArticleSkeleton;
