import React, { createContext, useEffect, useState, useCallback, useContext } from 'react';

export const ThemeContext = createContext();

/* ‼️ ה־Provider היחיד שתצטרכי בפרויקט */
export function ThemeProvider({ children }) {
  // 1. יטעין את הבחירה מ-localStorage כבר בהתחלה
  const [darkMode, setDarkMode] = useState(() =>
    window.localStorage.getItem('theme') === 'dark'
  );

  // 2. whenever darkMode changes → הוספה/הסרה של המחלקה
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // 3. פונקציית החלפה
  const toggleTheme = useCallback(() => setDarkMode(prev => !prev), []);

  // 4. חשיפה לילדים
  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ✨ helper קטן לשימוש נוח */
export const useTheme = () => useContext(ThemeContext);
