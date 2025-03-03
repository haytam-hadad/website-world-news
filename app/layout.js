"use client";
import "./globals.css";
import { ThemeProvider, ThemeContext } from "./ThemeProvider";
import { useContext } from "react";

function LayoutContent({ children }) {
  const { theme } = useContext(ThemeContext);

  return (
    <html lang="en" className={`${theme ? "dark" : "light"}`}>
      <body className="dark:bg-thirdColor bg-secondaryColor dark:text-secondaryColor">
        {children}
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
