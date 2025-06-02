import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // We'll use localStorage to persist theme preference
  const [theme, setTheme] = useState<Theme>(() => {
    // Always start with dark theme for this application as per design
    // but check if user has previously set a preference
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || "dark";
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem("theme", theme);
    
    // Toggle the class on the document element
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
}
