"use client";
import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GoUp } from "../components/GoUp";
import SideMenu from "../components/SideMenu";
import { ThemeContext } from "../ThemeProvider";
import { useState, useContext, useEffect, useCallback } from "react";

// Custom hook to track window width
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const handleResize = useCallback(() => setWidth(window.innerWidth), []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return width;
}

function LayoutContent({ children }) {
  const { theme } = useContext(ThemeContext);
  const [showMenu, setShowMenu] = useState(false);
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth >= 768;

  return (
    <>
      <Header onToggleMenu={() => setShowMenu((prev) => !prev)} />
      <main className="relative flex">
        {/* Side Menu */}
        {isDesktop && (
          <div className="w-[250px]">
            <SideMenu setVisible={setShowMenu} />
          </div>
        )}

        {/* Mobile Side Menu (Overlay) */}
        {!isDesktop && showMenu && (
          <div className="md:hidden relative">
            <SideMenu setVisible={setShowMenu} />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 p-1 md:p-3 overflow-y-hidden bg-lightgrey dark:bg-thirdColor">
          {children}
        </div>
      </main>
      <GoUp />
      <Footer />
    </>
  );
}

export default function MainLayout({ children }) {
  return <LayoutContent>{children}</LayoutContent>; // No extra ThemeProvider here
}
