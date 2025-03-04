"use client";
import { useState, useContext } from "react";
import { ThemeContext } from "../ThemeProvider";
import Link from "next/link";
import Footer from "../components/Footer";
import { ArrowLeft } from "lucide-react";

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
      <div className="sticky top-0 z-30 p-6">
        <button
          onClick={() => window.history.back()}
          className="rounded-full bg-primary-foreground text-primary-foreground text-md z-30 border p-3 px-4 font-bold text-gray-800 shadow-md dark:bg-gray-800 dark:text-white flex items-center"
        >
          <ArrowLeft className="h-5 w-5 text-primary"/>
          <span className="ml-3 text-primary">Go Back</span>
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

