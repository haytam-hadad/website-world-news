"use client";
import { useState, useContext } from "react";
import { ThemeContext } from "../ThemeProvider";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";


function LayoutContent({ children }) {
  const { theme, setTheme, user, setUser } = useContext(ThemeContext);

  return (
    <div>
      <button
        onClick={() => window.history.back()}
        className="fixed top-4 left-4 rounded-full text-secondaryColor bg-secondary-foreground hover:bg-mainColor hover:text-secondaryColor text-md z-30 border p-3 px-4 font-bold shadow-md dark:bg-gray-800 dark:text-white flex items-center"
      >
        <ArrowLeft className="h-5 w-5 text-secondaryColor"/>
        <span className="mx-3">Go Back</span>
      </button>
      <main className="relative flex">
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function MainLayout({ children }) {
  return <LayoutContent>{children}</LayoutContent>;
}

