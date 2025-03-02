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
  Plus,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { usePathname } from "next/navigation";

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
  const [categoriesVisible, setCategoriesVisible] = useState(true);
  const { theme, setTheme, user } = useContext(ThemeContext);
  const activePath = usePathname();


  console.log("Active Path:", activePath); // Debugging line

  return (
    <motion.div
      className="bg-white border-r dark:bg-darkgrey select-none p-4 z-40 w-[250px] h-full fixed top-16 overflow-y-auto left-0"
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
          onClick={() => setVisible(false)}
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
        <Link href="/add">
          <button
            onClick={() => setVisible(false)}
            className={`side_menu_link ${
              activePath === "/add" ? "bg-mainColor text-white" : "text-mainColor"
            }`}
          >
            <Plus size={20} />
            <span className="text-base font-semibold">POST</span>
          </button>
        </Link>
      )}

      {!user && (
        <Link href="/trends">
          <button
            onClick={() => setVisible(false)}
            className={`flex sm:hidden mb-1 text-lg space-x-3 justify-center items-center text-center w-full p-3 rounded-2xl border-2 border-mainColor ${
              activePath === "/trends" ? "bg-mainColor text-white" : "text-mainColor"
            }`}
            aria-label="Log in"
          >
            <span className="text-base font-medium">Log in</span>
          </button>
        </Link>
      )}

      <Link href="/trends">
        <button
          onClick={() => setVisible(false)}
          className={`side_menu_link ${
            activePath === "/trends" ? "bg-mainColor text-white" : "text-primary"
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
        <AnimatePresence initial={false}>
          {categoriesVisible &&
            menuItems.map(({ name, path, icon }) => (
              <motion.div
                key={path}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={path}>
                  <button
                    onClick={() => setVisible(false)}
                    className={`side_menu_link ${
                      activePath === path ? "bg-mainColor text-white" : "text-primary"
                    }`}
                  >
                    {icon}
                    <span className="text-base font-medium">{name}</span>
                  </button>
                </Link>
                {console.log("Menu Item Path:", path)} {/* Debugging line */}
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SideMenu;

