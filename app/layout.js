"use client";
import Footer from "./components/Footer";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="bg-secondaryColor dark:bg-thirdColor" >
        <ThemeProvider>
            {children} 
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}
