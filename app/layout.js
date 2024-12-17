"use client";
import "./globals.css";
import Header from "./components/Header";
import { useState } from "react";




export default function RootLayout({ children }) {
  const [theme, setTheme] = useState(false);
  return (
    <html lang="en" className={theme == true ? "dark" : ""}>
      <body className="dark:bg-thirdColor dark:text-secondaryColor">
        <Header setTheme={setTheme} theme={theme}/>
        <main className=" mx-auto max-w-[90%]">
          {children}
        </main>
        
      </body>
    </html>
  );
}
