"use client";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { createContext, useState } from "react";
export const ThemeContext = createContext();

export const favicon = (
  <link rel="icon" href="/images/favicon.png" type="image/png" sizes="16x16" />
);

export const meta = (
  <>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <meta
      name="description"
      content="World News is a news website that provides the latest news from around the world."
    />
    <meta
      name="keywords"
      content="News, World News, Latest News, Breaking News, News Website"
    />
    <meta name="author" content="World News" />
  </>
);

export default function RootLayout({ children }) {

  //States
  const [theme, setTheme] = useState(false);


  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <html lang="en" className={theme == true ? "dark" : ""}>
        <body className="dark:bg-thirdColor bg-secondaryColor dark:text-secondaryColor ">
          <Header/>
          <main className=" mx-auto max-w-[90%] mb-7">
            {children}
          </main>
          <Footer/>
        </body>
      </html>
    </ThemeContext.Provider>
  );
}
