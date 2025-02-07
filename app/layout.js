"use client";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SideMenu from "./components/SideMenu";
import { ThemeProvider, ThemeContext } from "./ThemeProvider";
import { useState, useContext, useEffect } from "react";

// Custom hook to track window width
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

function LayoutContent({ children }) {
  const { theme } = useContext(ThemeContext);
  const [showMenu, setShowMenu] = useState(false); // controls mobile side menu visibility
  const [menuWidth, setMenuWidth] = useState(250); // initial width for the side menu
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth >= 768; // md breakpoint

  return (
    <html lang="en" className={`${theme ? "dark" : "light"}`}>
      <body className="dark:bg-thirdColor bg-secondaryColor dark:text-secondaryColor">
        {/* Pass the toggle function to Header for mobile */}
        <Header onToggleMenu={() => setShowMenu((prev) => !prev)} />
        <main className="relative flex">
          {/* Desktop: Always visible side menu */}
          {isDesktop && (
            <div className="hidden md:block">
              <SideMenu setVisible={setShowMenu} setMenuWidth={setMenuWidth} />
            </div>
          )}
          {/* Mobile: Overlay side menu when toggled */}
          {!isDesktop && showMenu && (
            <div className="md:hidden absolute top-0 left-0 z-50">
              <SideMenu setVisible={setShowMenu} setMenuWidth={setMenuWidth} />
            </div>
          )}
          {/* Main Content */}
          <div
            className="flex-1 p-4 transition-all"
            style={{
              marginLeft: isDesktop ? `${menuWidth}px` : "0px",
              transition: "margin-left 0.3s ease-in-out",
            }}
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
