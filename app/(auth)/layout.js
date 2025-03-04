"use client";
import { useState, useContext } from "react";
import { ThemeContext } from "../ThemeProvider";
import Link from "next/link";
import Footer from "../components/Footer";

function LayoutContent({ children }) {
  const { theme, setTheme, user, setUser } = useContext(ThemeContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logout = async () => {
    if (!user) return console.log("User is not logged in");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.status === 200) {
        console.log("Logout successful");
        setUser(null);
        window.location.href = "/";
      } else {
        console.log("Logout failed", response.status);
      }
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <div className="bg-[url('/images/D2.png')] dark:bg-[url('/images/D1.png')] bg-no-repeat bg-bottom bg-cover">
      <div className="sticky top-0 z-30 p-5">
        <button
          onClick={() => window.history.back()}
          className="rounded-full bg-primary-foreground text-primary-foreground text-md z-30 border p-3 px-4 font-bold text-gray-800 shadow-md dark:bg-gray-800 dark:text-white flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="ml-3">Go Back</span>
        </button>
      </div>
      <main className="relative flex">
        <div className="flex-1 p-1">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function MainLayout({ children }) {
  return <LayoutContent>{children}</LayoutContent>;
}

