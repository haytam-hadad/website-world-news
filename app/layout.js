"use client";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SideMenu from "./components/SideMenu";
import { ThemeProvider, ThemeContext } from "./ThemeProvider";
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
  const [menuWidth, setMenuWidth] = useState(250);
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth >= 768;

  return (
    <html lang="en" className={`${theme ? "dark" : "light"}`}>
      <body className="dark:bg-thirdColor bg-secondaryColor dark:text-secondaryColor">
        <Header onToggleMenu={() => setShowMenu((prev) => !prev)} />
        <main className="relative flex">
          {isDesktop && (
            <div className="hidden md:block overflow-y-auto">
              <SideMenu setVisible={setShowMenu} setMenuWidth={setMenuWidth} />
            </div>
          )}
          {!isDesktop && showMenu && (
            <div className="md:hidden absolute top-0 left-0 z-50 overflow-y-auto">
              <SideMenu setVisible={setShowMenu} setMenuWidth={setMenuWidth} />
            </div>
          )}
          <div
            className="flex-1 p-2 overflow-y-hidden"
            style={{ marginLeft: isDesktop ? `${menuWidth}px` : "0px" }}
          >
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}

export default function Layout({ children }) {
  return (
    <ThemeProvider>
      <LayoutContent>{children}</LayoutContent>
    </ThemeProvider>
  );
}
