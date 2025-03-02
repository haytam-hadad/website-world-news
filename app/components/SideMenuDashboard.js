"use client";

import { useState, useContext } from "react";
import { ThemeContext } from "../ThemeProvider";
import { Home, FileText, Layers, Tag, Users, Settings, Edit3, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Overview",
    path: "/dashboard",
    icon: <Home size={20} />,
  },
  {
    name: "Update Info",
    path: "/update-info",
    icon: <Edit3 size={20} />,
  },
  {
    name: "Articles",
    path: "/dashboard/articles",
    icon: <FileText size={20} />,
  },
  {
    name: "Categories",
    path: "/dashboard/categories",
    icon: <Layers size={20} />,
  },
  {
    name: "Tags",
    path: "/dashboard/tags",
    icon: <Tag size={20} />,
  },
  {
    name: "Users",
    path: "/dashboard/users",
    icon: <Users size={20} />,
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: <Settings size={20} />,
  }
];

const SideMenuDashboard = ({ setVisible }) => {
  const [categoriesVisible, setCategoriesVisible] = useState(true);
  const { theme, setTheme, user } = useContext(ThemeContext);
  const activePath = usePathname();

  return (
    <motion.div
      className="bg-mainColor text-white select-none p-4 z-40 w-[250px] h-full fixed top-16 overflow-y-auto left-0"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      transition={{ duration: 0.25 }}
    >
      <div>
        <button
          onClick={() => setTheme(!theme)}
          className="side_menu_link_dashboard border sm:hidden"
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

      {menuItems.map(({ name, path, icon }) => (
        <Link href={path} key={path}>
          <button
            onClick={() => setVisible(false)}
            className={`side_menu_link_dashboard ${
              activePath === path ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            {icon}
            <span className="text-base font-medium">{name}</span>
          </button>
        </Link>
      ))}
    </motion.div>
  );
};

export default SideMenuDashboard;

