"use client"; // This ensures it's a client component
import { createContext, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, user, setUser }}>
      {children}
    </ThemeContext.Provider>
  );
}

