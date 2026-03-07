import { useState, useCallback } from "react";

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const newValue = !prev;
      localStorage.setItem("theme", JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  return { isDark, toggleTheme };
};
