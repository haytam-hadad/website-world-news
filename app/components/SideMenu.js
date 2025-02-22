"use client";

import { useState, useContext } from "react";
import { ThemeContext } from "../ThemeProvider";
import {
  Home,
  Laptop,
  HeartPulse,
  Trophy,
  Landmark,
  ChartNoAxesCombined,
  ChevronUp,
  ChevronDown,
  TestTube,
  SquarePlus,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Label } from "@/components/ui/label";

const menuItems = [
  {
    name: "Technology",
    path: "/category/technology",
    icon: <Laptop size={20} />,
  },
  { name: "Health", path: "/category/health", icon: <HeartPulse size={20} /> },
  { name: "Sports", path: "/category/sports", icon: <Trophy size={20} /> },
  {
    name: "Politics",
    path: "/category/politics",
    icon: <Landmark size={20} />,
  },
  { name: "Science", path: "/category/science", icon: <TestTube size={20} /> },
];

const SideMenu = ({ setVisible }) => {
  const [activePath, setActivePath] = useState("/");
  const [categoriesVisible, setCategoriesVisible] = useState(true);
  const { theme, setTheme, user } = useContext(ThemeContext);

  return (
    <motion.div
      className="bg-lightgrey border-r dark:bg-darkgrey select-none p-4 z-40 w-[250px] h-full fixed top-16 overflow-y-auto left-0"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      transition={{ duration: 0.25 }}
    >
      <div>
        <button
          onClick={() => setTheme(!theme)}
          className="side_menu_link border sm:hidden"
          aria-label="Toggle Dark Mode"
        >
          <div className="flex items-center gap-3">
            <Label>Theme:</Label>
            {theme ? (
              <Sun className="w-5 h-5 opacity-90" />
            ) : (
              <Moon className="w-5 h-5 opacity-90" />
            )}
          </div>
        </button>
      </div>

      <Link href="/">
        <button
          onClick={() => {
            setActivePath("/");
            setVisible(false);
          }}
          className={`side_menu_link ${
            activePath === "/" ? "bg-mainColor text-white" : "text-primary"
          }`}
          aria-label="Home"
        >
          <Home size={20} />
          <span className="text-base font-medium">Home</span>
        </button>
      </Link>

      {user && (
        <Link href="/addpost">
          <button
            onClick={() => setVisible(false)}
            className="side_menu_link text-mainColor"
          >
            <SquarePlus size={20} />
            <span className="text-base font-bold">Post</span>
          </button>
        </Link>
      )}

      <Link href="/trends">
        <button
          onClick={() => {
            setActivePath("/trends");
            setVisible(false);
          }}
          className={`side_menu_link ${
            activePath === "/trends"
              ? "bg-mainColor text-white"
              : "text-primary"
          }`}
          aria-label="Trends"
        >
          <ChartNoAxesCombined size={20} />
          <span className="text-base font-medium">Trends</span>
        </button>
      </Link>

      <hr className="my-2 border-gray-300 dark:border-gray-700" />
      <div>
        <h2
          className="text-md flex items-center gap-1 justify-center font-medium cursor-pointer opacity-75"
          onClick={() => setCategoriesVisible(!categoriesVisible)}
        >
          Categories
          {categoriesVisible ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </h2>
        <AnimatePresence>
          {categoriesVisible &&
            menuItems.map(({ name, path, icon }) => (
              <Link key={path} href={path}>
                <button
                  onClick={() => setVisible(false)}
                  className="side_menu_link"
                >
                  {icon}
                  <span className="text-base font-medium">{name}</span>
                </button>
              </Link>
            ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SideMenu;

