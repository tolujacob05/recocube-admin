import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "./ui/button";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Button
      onClick={toggleTheme}
      variant={"ghost"}
      className={
        theme === "dark" ? "border-muted-foreground" : "border-muted-foreground"
      }
    >
      <Icon
        icon={theme === "dark" ? "fa6-solid:moon" : "iconamoon:mode-light-bold"}
        width="24"
        height="24"
        className={theme === "dark" ? "text-white" : "text-black"}
      />
    </Button>
  );
};

export default ThemeToggle;
