"use client";
import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(false);
  const [user, setUser] = useState(null); // User data only in state
  const [isMounted, setIsMounted] = useState(false); // Ensure client-side loading

  useEffect(() => {
    const initializeTheme = async () => {
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("theme") === "true";
        setThemeState(savedTheme);
        setIsMounted(true);
        
        // Apply theme class to <html> on initial load
        document.documentElement.classList.toggle("dark", savedTheme);
      }
    };

    initializeTheme();
  }, []);


  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme ? "true" : "false");

    // Apply theme class to <html> dynamically
    document.documentElement.classList.toggle("dark", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, user, setUser }}>
      {isMounted ? children : null} {/* Prevents hydration mismatch */}
    </ThemeContext.Provider>
  );
}

