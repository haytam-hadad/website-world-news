"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleX } from "lucide-react"; // Import error icon from lucide

const ErrorPage = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-foreground ">
      <div className="bg-primary-foreground p-8">
        <div className="flex items-center gap-2 justify-center">
          <CircleX className="h-12 w-12" /> {/* Add error icon from lucide */}
          <h2 className="text-5xl font-bold text-primary">Error</h2>          
        </div>

        <p className="mt-4 text-lg text-primary">{message}</p>
        <div className="mt-8">
          <Link href="/">
            <span className="text-mainColor hover:text-blue-700">
              Go back home
            </span>
          </Link>
          <button
            className="ml-4 text-red-500 hover:text-red-700"
            onClick={() => setIsVisible(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;

