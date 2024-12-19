"use client";

import { Skeleton } from "@/components/ui/skeleton";

const SkeletonArticle = ({ num = 1 }) => {
  return (
    <>
      {[...Array(num)].map((_, i) => (
        <article key={i} className="border flex mx-auto items-center justify-between shadow-sm p-2 h-[60vh] flex-col flex-1 gap-1 min-w-[300px] rounded-xl">
          <Skeleton className="h-[50%] w-full rounded-lg" />
          <div className="flex items-center gap-2 w-full">
            <Skeleton className="h-8 w-9 rounded-full" />
            <Skeleton className="h-5 w-full rounded-lg" />
          </div>
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />  
          <div className="flex  gap-2 w-full">
            <Skeleton className="h-5 w-full rounded-lg" />
            <Skeleton className="h-5 w-full rounded-lg" />
          </div>
        </article>
      ))}
    </>
  );

};

export default SkeletonArticle;

