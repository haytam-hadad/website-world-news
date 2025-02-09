"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock3, ArrowUpRight, Share2, MessageCircle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";

const Article = ({ title, desc, imageUrl, author, publishedAt, category, url }) => {
  const [vote, setVote] = useState(null);

  const handleUpvote = () => {
    setVote(vote !== "upvote" ? "upvote" : null);
  };

  const handleDownvote = () => {
    setVote(vote !== "downvote" ? "downvote" : null);
  };


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
  

  // Function to check if the URL is valid
  const isValidUrl = (url) => {
    try {
      new URL(url); // If URL is valid, it won't throw an error
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <article className="flex w-full m-1 flex-col lg:flex-row bg-lightgrey dark:bg-darkgrey border p-4 max-w-4xl mx-auto rounded-xl shadow-sm">
      <div className="flex flex-col  lg:flex-row items-center space-y-1 lg:space-y-0 lg:space-x-6 w-full">
        {/* Only render image section if imageUrl is available */}
        {imageUrl && (
          <div className="w-full border-mainColor h-60 md:max-w-[95%] lg:h-[350px] relative rounded-xl overflow-hidden mb-2 lg:mb-0">
            <Image
              className="w-full h-full object-cover rounded-xl"
              src={imageUrl}
              alt={title}
              width={400}
              height={300}
            />
          </div>
        )}

        {/* Content Section */}
        <div className="flex flex-col justify-between w-full">
          <header className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2 p-1">
            <div className="flex items-center space-x-2">
              {/* Use a default icon or placeholder for author if no image */}
              <div className="rounded-full cursor-pointer border-mainColor bg-gray-300 dark:bg-gray-700 w-10 h-10 flex items-center justify-center text-white font-bold">
                {author ? author[0].toUpperCase() : "A"}
              </div>
              <div className="flex flex-col">
                <span className="truncate capitalize cursor-pointer hover:underline text-gray-900 dark:text-gray-100 text-lg">{author}</span>
              </div>
            </div>

            <span className="text-xs capitalize flex items-center text-gray-400">{getTimeDifference(publishedAt)} &nbsp; <Clock3 className="h-4 w-4 inline-block" /></span>
          </header>

          <h1 className="font-serif font-semibold text-2xl sm:text-3xl capitalize text-gray-900 dark:text-gray-100 mb-3">{title}</h1>

          <p className="text-md text-gray-600 dark:text-gray-300 line-clamp-4 mb-6">{desc || "No description available"}</p>

          <div className="flex items-center justify-between space-x-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-full cursor-pointer">
                <div
                  className={`p-1 rounded-full cursor-pointer hover:text-mainColor ${vote === "upvote" ? "text-green-500" : "text-gray-500"}`}
                  onClick={handleUpvote}
                >
                  <span className="flex items-center space-x-1">
                    <ArrowBigUp className="w-7 h-7 transition-transform transform hover:scale-110" />
                    <span>20</span>
                  </span>
                </div>
                <div className="h-5 w-0.5 bg-gray-400 dark:bg-gray-500" />
                <div
                  className={`p-1 rounded-full cursor-pointer hover:text-mainColor ${vote === "downvote" ? "text-red-500" : "text-gray-500"}`}
                  onClick={handleDownvote}
                >
                  <ArrowBigDown className="w-7 h-7 transition-transform transform hover:scale-110" />
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full cursor-pointer text-gray-500 hover:text-blue-500">
                <MessageCircle className="w-5 h-5 transition-transform transform hover:scale-110" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full cursor-pointer text-gray-500 hover:text-blue-500">
                <Share2 className="w-5 h-5 transition-transform transform hover:scale-110" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full cursor-pointer text-gray-500 hover:text-blue-500">
                <MoreHorizontal className="w-5 h-5 transition-transform transform hover:scale-110" />
              </div>
            </div>

            <div className="flex items-center space-x-6 cursor-pointer text-gray-500 hover:text-blue-500">
              <p className="text-blue-500 cursor-pointer font-semibold capitalize text-md">{category || "General"}</p>
            </div>
          </div>

          <footer className="flex items-center justify-between mt-4 gap-3">
            <Link
              className="flex text-sm items-center justify-center hover:underline w-full sm:w-auto text-center p-2 px-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full shadow-sm"
              href={isValidUrl(url) ? url : "#"} // Only set the URL if it's valid
              target="_blank"
            >
              Continue reading <ArrowUpRight className="ml-2 w-5 h-5" />
            </Link>
          </footer>
        </div>
      </div>
    </article>
  );
};

export default Article;
