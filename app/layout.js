"use client";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="bg-primary-foreground" >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
