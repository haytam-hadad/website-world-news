"use client";
import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeTheme = async () => {
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("theme") === "true";
        setThemeState(savedTheme);
        
        // Apply theme class to <html> on initial load
        document.documentElement.classList.toggle("dark", savedTheme);
      }
    };
    initializeTheme();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/status`, { credentials: "include" });
        const userData = await res.json();
        if (res.ok) {
          setUser(userData);
        }
      } catch (error) {
        // Ignore errors
      }
    };

    fetchUser();
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme ? "true" : "false");

    // Apply theme class to <html> dynamically
    document.documentElement.classList.toggle("dark", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, user, setUser }}>
      {children}
    </ThemeContext.Provider>
  );
}

