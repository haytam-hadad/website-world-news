import Link from "next/link";
import Image from "next/image";
import { Clock3 } from "lucide-react";

const Article = ({ title, desc }) => {
  return (
    <div className="flex bg-[rgba(128,128,128,0.04)] border p-1 max-sm:max-w-[100%] max-w-[55%] mx-auto flex-col flex-1 gap-1 min-w-[300px] rounded-2xl overflow-hidden">
      <div className="rounded-xl overflow-hidden w-full h-fit">
        <Image
          className="w-full max-h-50 object-cover"
          src="/images/image.jpg"
          alt="www"
          width={400}
          height={200}
        />
        <div className="flex items-center justify-between bg-thirdColor p-2 text-sm text-secondaryColor dark:bg-secondaryColor dark:text-mainTextColor font-semibold">
          <Link
            className="cursor-pointer rounded-xl hover:underline flex items-center"
            href="https://www.bbc.com/news"
            target="_blank"
          >
            <Image
              className="rounded-full w-7 h-7 ml-1 mr-3 outline outline-2 outline-mainColor outline-offset-2"
              src="/images/image.jpg"
              alt="www"
              width={400}
              height={200}
            />
            BBC - news
          </Link>
          <span className="separator">|</span>
          <p className="text-[gray] flex items-center">
            2 hours ago <Clock3 className="mx-2 h-4 w-3" />{" "}
          </p>
        </div>
      </div>

      <h1 className="font-bold font-serif text-3xl p-2 px-3 underline ">{title}</h1>
      <p className="text-md  p-2 px-3 flex-grow">{desc}</p>
      <div className="flex justify-between items-center mt-3">
        <Link
          className=" hover:underline w-1/2 min-w-fit text-center p-1 px-4 bg-mainColor text-secondaryColor rounded-full"
          href="#"
          target="_blank"
        >
          Read full article
        </Link>
        <p className="text-mainColor cursor-pointer font-semibold p-1 mx-1 capitalize text-md">
          sports
        </p>
      </div>
    </div>
  );
};

export default Article;
