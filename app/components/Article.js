"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock3 } from "lucide-react";
import { ArrowUpRight } from 'lucide-react';

const Article = ({ title, desc }) => {
  return (
    <article className="border flex shadow-sm p-1 max-sm:max-w-[100%] max-w-[55%] mx-auto flex-col flex-1 gap-1 min-w-[300px] rounded-2xl overflow-hidden group">
      <div className="rounded-xl group overflow-hidden w-full h-fit">
        <Image
          className="w-full group-hover:brightness-105 max-h-50 object-cover"
          src="/images/image.jpg"
          alt="www"
          width={400}
          height={200}
        />
        <div className="flex items-center justify-between bg-thirdColor p-2 text-sm text-secondaryColor dark:bg-secondaryColor dark:text-mainTextColor font-semibold">
          <Link
            className=" rounded-xl flex items-center"
            href="https://www.bbc.com/news"
            target="_blank"
          >
            <div className="flex items-center cursor-pointer hover:underline ">
              <Image
                className="rounded-full w-7 h-7 ml-1 mr-3 outline outline-2 outline-mainColor outline-offset-2"
                src="/images/image.jpg"
                alt="www"
                width={400}
                height={200}
              />
              <span className="first-letter:capitalize">BBC - news</span>
            </div>
            <span className="separator mx-2">|</span>
            <p className="text-[gray] flex items-center text-xs">
              2 hours ago <Clock3 className="mx-1 h-4 w-3" />
            </p>
          </Link>
          <button
            className=" px-2 py-1 outline shadow-md outline-mainColor outline-2 transition-all bg-mainColor text-secondaryColor rounded-full duration-200 hover:scale-105"
            onClick={(e) => {
              const button = e.currentTarget;
              button.classList.toggle("bg-mainColor");
              button.classList.toggle("bg-transparent");
              button.classList.toggle("text-secondaryColor");
              button.classList.toggle("text-mainColor");

              button.innerText =
                button.innerText === "Follow" ? "Unfollow" : "Follow";
            }}
          >
            Follow
          </button>
        </div>
      </div>

      <h1 className="font-bold font-serif underline underline-offset-4 border-l-4 border-mainColor text-2xl p-2 px-3 first-letter:capitalize">
        {title}
      </h1>
      <p className="text-md p-2 px-3 flex-grow first-letter:capitalize line-clamp-5">
        {desc}
      </p>
      <hr/>
      <div className="flex items-center justify-between mt-2">
        <Link
          className="flex text-sm items-center justify-center hover:underline w-1/2 min-w-fit text-center p-1 bg-mainColor text-secondaryColor rounded-full"
          href="#"
          target="_blank"
        >
          Continue reading <ArrowUpRight className="w-5 h-5" />
        </Link>
        <p className="text-mainColor cursor-pointer font-semibold p-1 mx-1 capitalize text-md">
          sports
        </p>
      </div>
    </article>
  );
};

export default Article;
