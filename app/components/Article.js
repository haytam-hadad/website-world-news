"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock3, ArrowUpRight } from "lucide-react";

const Article = ({ title, desc, imageUrl, author, publishedAt, category, url }) => {
  const placeholder = "/images/image.jpg";

  const getTimeDifference = (publishedAt) => {
    if (!publishedAt) return "N/A";
    const publishedDate = new Date(publishedAt);
    if (isNaN(publishedDate.getTime())) return "N/A";

    const now = new Date();
    const diffInSeconds = Math.floor((now - publishedDate) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  };

  return (
    <article className="border bg-lightgrey dark:bg-darkgrey shadow-sm p-3 flex flex-col lg:flex-row gap-3 w-full max-w-6xl mx-auto rounded-xl overflow-hidden">
      {/* Image Section */}
      <div className="w-full lg:w-2/5 rounded-xl overflow-hidden flex-shrink-0">
        <Image
          className="w-full h-auto max-h-[250px] sm:max-h-[350px] lg:max-h-[400px] object-cover"
          src={imageUrl || placeholder}
          alt={title}
          width={800}
          height={400}
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-3 space-y-3">
        {/* Author & Timestamp */}
        <header className="flex items-center justify-between p-2 bg-thirdColor text-sm text-secondaryColor dark:bg-secondaryColor dark:text-mainTextColor rounded-md">
          <Link className="flex items-center min-w-0 space-x-2" href={url || "#"} target="_blank">
            <Image
              className="rounded-full w-8 h-8 outline outline-2 outline-mainColor outline-offset-2"
              src={imageUrl || placeholder}
              alt={author}
              width={40}
              height={40}
            />
            <span className="truncate capitalize">{author}</span>
            <span className="mx-2 hidden sm:inline">|</span>
            <p className="text-gray-500 text-xs flex items-center">
              {getTimeDifference(publishedAt)} <Clock3 className="ml-1 h-4 w-4" />
            </p>
          </Link>

          {/* Follow Button */}
          <button
            className="px-3 py-1 shadow-md outline outline-mainColor outline-2 bg-mainColor text-secondaryColor rounded-full"
            onClick={(e) => {
              const button = e.currentTarget;
              button.classList.toggle("bg-mainColor");
              button.classList.toggle("bg-transparent");
              button.classList.toggle("text-secondaryColor");
              button.classList.toggle("text-mainColor");

              button.innerText = button.innerText === "Follow" ? "Unfollow" : "Follow";
            }}
          >
            Follow
          </button>
        </header>

        {/* Title */}
        <h1 className="font-serif font-semibold text-xl sm:text-2xl capitalize underline underline-offset-4">
          {title}
        </h1>

        {/* Description */}
        <p className="text-md line-clamp-4 sm:line-clamp-5">{desc || "No description available"}</p>

        {/* Footer Section */}
        <footer className="flex items-center justify-between mt-2 gap-3">
          <Link
            className="flex text-sm items-center justify-center hover:underline w-full sm:w-auto text-center p-2 bg-mainColor text-secondaryColor rounded-full"
            href={url || "#"}
            target="_blank"
          >
            Continue reading <ArrowUpRight className="ml-1 w-5 h-5" />
          </Link>
          <p className="text-mainColor dark:text-secondaryColor cursor-pointer font-semibold capitalize text-md">
            {category || "General"}
          </p>
        </footer>
      </div>
    </article>
  );
};

export default Article;
