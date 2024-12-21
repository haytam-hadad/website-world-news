"use client";
import "./globals.css";
import Header from "./components/Header";
import { createContext, useState } from "react";
export const ThemeContext = createContext();


export default function RootLayout({ children }) {

  //States
  const [theme, setTheme] = useState(false);



  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <html lang="en" className={theme == true ? "dark" : ""}>
        <body className="dark:bg-thirdColor bg-secondaryColor dark:text-secondaryColor ">
          <Header/>
          <main className=" mx-auto max-w-[90%]">
            {children}
          </main>
          
        </body>
      </html>
    </ThemeContext.Provider>
  );
}
