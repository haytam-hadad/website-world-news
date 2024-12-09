import Link from "next/link";
import Image from "next/image";
import { Clock3 } from 'lucide-react';

const Article = ({ title, desc }) => {
  return (
    <div className="flex hover:shadow-md flex-col border shadow-sm flex-1 p-1 gap-1 min-w-[300px] rounded-xl overflow-hidden">
      <div className="rounded-lg overflow-hidden w-full h-fit">
        <Image
          className="w-full max-h-50 object-cover"
          src="/images/image.jpg"
          alt="www"
          width={400}
          height={200}
        />
      </div>

      <div className="flex items-center justify-between bg-thirdColor p-2 text-secondaryColor dark:bg-secondaryColor dark:text-mainTextColor rounded-lg font-semibold">
        <Link
          className="cursor-pointer rounded-xl hover:underline flex items-center"
          href="https://www.bbc.com/news"
          target="_blank"
        >
          <Image
            className="rounded-full w-7 h-7 mr-3 outline outline-2 outline-mainColor outline-offset-2"
            src="/images/image.jpg"
            alt="www"
            width={400}
            height={200}
          />
          BBC - news
        </Link> 
        <span className="separator"> | </span>
        <p className="text-[gray] flex items-center">2 hours ago <Clock3 className="mx-1 h-4 w-3" /> </p>
      </div>
      <h1 className="font-bold font-serif text-3xl p-3 underline ">{title}</h1>
      <p className="text-md  px-3 py-1 flex-grow">{desc}</p>
      <div className="flex p-1 justify-between items-center mt-3">
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
