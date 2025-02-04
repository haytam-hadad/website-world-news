"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock3, ArrowUpRight } from "lucide-react";

const Article = ({ title, desc, imageUrl, author, publishedAt, category, url }) => {
  const placeholder = "/images/image.jpg";

  // Function to calculate the time difference
  const getTimeDifference = (publishedAt) => {
    if (!publishedAt) return "N/A";
    
    const publishedDate = new Date(publishedAt);
    
    // Logging the date to debug
    console.log('Published Date:', publishedDate);
    
    // Check if the date is valid
    if (isNaN(publishedDate.getTime())) {
      console.log('Invalid date:', publishedAt);
      return "N/A"; // Return "N/A" for invalid dates
    }
  
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
    <article className="border flex shadow-sm p-1 flex-col gap-2 min-w-[310px] w-full sm:w-[45%] md:w-[40%] lg:w-[30%] mx-auto rounded-2xl overflow-hidden group">
      <div className="rounded-xl overflow-hidden w-full h-fit">
        <Image
          className="w-full group-hover:brightness-105 max-h-50 object-cover"
          src={imageUrl || placeholder}
          alt={title}
          width={400}
          height={200}
        />
        <div className="flex items-center justify-between bg-thirdColor p-2 text-sm text-secondaryColor dark:bg-secondaryColor dark:text-mainTextColor font-semibold">
          <Link className="rounded-xl flex items-center" href={url || "#"} target="_blank">
            <div className="flex items-center cursor-pointer hover:underline">
              <Image
                className="rounded-full w-7 h-7 ml-1 mr-3 outline outline-2 outline-mainColor outline-offset-2"
                src={imageUrl || placeholder}
                alt={author}
                width={40}
                height={40}
              />
              <span className="first-letter:capitalize">{author}</span>
            </div>
            <span className="separator mx-2">|</span>
            <p className="text-[gray] flex items-center text-xs">
              {getTimeDifference(publishedAt)} <Clock3 className="mx-1 h-4 w-3" />
            </p>
          </Link>
          <button
            className="px-2 py-1 outline shadow-md outline-mainColor outline-2 transition-all bg-mainColor text-secondaryColor rounded-full duration-200 hover:scale-105"
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
        </div>
      </div>

      <h1 className="font-bold font-serif underline underline-offset-4 text-2xl py-1 px-2 first-letter:capitalize">
        {title}
      </h1>
      <p className="text-md p-2 px-3 flex-grow first-letter:capitalize line-clamp-5">
        {desc || "No description available"}
      </p>
      <hr />
      <div className="flex items-center justify-between mt-2">
        <Link
          className="flex text-sm items-center justify-center hover:underline w-1/2 min-w-fit text-center p-1 bg-mainColor text-secondaryColor rounded-full"
          href={url || "#"}
          target="_blank"
        >
          Continue reading <ArrowUpRight className="w-5 h-5" />
        </Link>
        <p className="text-mainColor dark:text-secondaryColor cursor-pointer font-semibold p-1 mx-1 capitalize text-md">
          {category || "General"}
        </p>
      </div>
    </article>
  );
};

export default Article;
