"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock3, ArrowUpRight, Share2, MessageCircle, MoreHorizontal, Flag } from "lucide-react";
import { useState } from "react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { motion } from "framer-motion";

const Article = ( {articleData} ) => {
  const { _id, title, content, imageUrl, author, publishedAt, category } = articleData;
  let url = `/post/${_id}`;
  const [vote, setVote] = useState(null);

  const handleUpvote = () => {
    setVote(vote !== "upvote" ? "upvote" : null);
  };

  const handleDownvote = () => {
    setVote(vote !== "downvote" ? "downvote" : null);
  };

  const calculateTimeAgo = (publishedAt) => {
    if (!publishedAt) return "N/A";

    const publishedDate = new Date(publishedAt);

    // Check if the date is valid
    if (isNaN(publishedDate.getTime())) return "N/A";

    const now = new Date();
    const diffInSeconds = Math.floor((now - publishedDate) / 1000);

    // Handle different time intervals
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  };  

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full my-2"
    >
      <div>
        <Link href={url ? url : "#"} className="flex hover:shadow-md cursor-pointer w-full flex-col lg:flex-row bg-white dark:bg-darkgrey border p-2 md:p-4 mx-auto rounded-xl shadow-sm">
          <div className="flex flex-col lg:flex-row items-center space-y-1 lg:space-y-1 lg:space-x-3 w-full">
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

            <div className="flex flex-col justify-between w-full">
              <header className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2 p-1">
                <div className="flex items-center space-x-2">
                  <Link href={`/profile/${author}`} className="rounded-full text-lg cursor-pointer border-mainColor bg-gray-300 dark:bg-gray-700 w-10 h-10 flex items-center justify-center text-white font-semibold">
                    {author ? author[0].toUpperCase() : "U"}
                  </Link>
                  <div className="flex flex-col">
                    <Link href={`/profile/${author}`} className="truncate max-sm:text-sm font-semibold capitalize cursor-pointer hover:underline text-gray-900 dark:text-gray-100 text-lg">
                      {author || "Unknown"}
                    </Link>
                  </div>
                </div>
                
                <span className="text-xs capitalize flex items-center text-gray-400">
                  {calculateTimeAgo(publishedAt)} &nbsp;
                  <Clock3 className="h-4 w-4 inline-block" />
                </span>
              </header>

              <h1 className="font-serif font-semibold text-2xl text-primary underline underline-offset-4 sm:text-2xl mx-1 my-4 capitalize text-gray-900">
                {title}
              </h1>

              <p className="text-md text-gray-600 dark:text-gray-300 line-clamp-4 mb-4">{content || "No content available"}</p>
              <hr className="mx-5"/>
              <div className="flex items-center justify-between space-x-6 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-full cursor-pointer">
                    <div
                      className={`p-1 rounded-full cursor-pointer hover:text-mainColor ${vote === "upvote" ? "text-green-500" : "text-gray-500"}`}
                      onClick={(e) => { e.preventDefault(); handleUpvote(); }}
                    >
                      <span className="flex items-center space-x-1">
                        <ArrowBigUp className="w-7 h-7 transition-transform transform hover:scale-110" />
                        <span>20</span>
                      </span>
                    </div>
                    <div className="h-5 w-0.5 bg-gray-400 dark:bg-gray-500" />
                    <div
                      className={`p-1 rounded-full cursor-pointer hover:text-mainColor ${vote === "downvote" ? "text-red-500" : "text-gray-500"}`}
                      onClick={(e) => { e.preventDefault(); handleDownvote(); }}
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
                    <Flag className="w-5 h-5 transition-transform transform hover:scale-110" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full cursor-pointer text-gray-500 hover:text-blue-500">
                    <MoreHorizontal className="w-5 h-5 transition-transform transform hover:scale-110" />
                  </div>
                </div>

                <Link href={`/category/${category}`} className="flex items-center space-x-6 cursor-pointer text-gray-500 hover:text-blue-500">
                  <p className="text-blue-500 cursor-pointer font-semibold capitalize text-md py-1 transition duration-300 px-2 hover:border border-transparent hover:border-mainColor rounded-full">{category || "General"}</p>
                </Link>
              </div>
            </div>
          </div>
        </Link>        
      </div>

    </motion.div>
  );
};

export default Article;

