"use client";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../ThemeProvider";
import HeaderDash from "../components/HeaderDash";
import SideMenuDashboard from "../components/SideMenuDashboard";


function useWindowWidth() {
  const [width, setWidth] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1024));

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function LayoutContent({ children }) {
  const { theme } = useContext(ThemeContext);
  const [showMenu, setShowMenu] = useState(false);
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth >= 768;

  return (
    <>
      <HeaderDash onToggleMenu={() => setShowMenu((prev) => !prev)} />
      <main className="relative flex">
        {isDesktop && (
          <div className="w-[250px]">
            <SideMenuDashboard setVisible={setShowMenu} />
          </div>
        )}
        {!isDesktop && showMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowMenu(false)}>
            <div className="absolute left-0 w-[250px] bg-white dark:bg-gray-900 shadow-lg h-full">
              <SideMenuDashboard setVisible={setShowMenu} />
            </div>
          </div>
        )}
        <div className="flex-1 p-1 md:p-3 overflow-auto bg-lightgrey dark:bg-thirdColor">
          {children}
        </div>
      </main>
    </>
  );
}

export default function MainLayout({ children }) {
  return <LayoutContent>{children}</LayoutContent>;
}
