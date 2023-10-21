"use client";
import { Theme, ThemeProvider } from "@/context/theme";
import { useState } from "react";

const Card = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(Theme.Dark);
  const onSetTheme = () => {
    setTheme((prevState: Theme) => {
      if (prevState === Theme.Dark) {
        return Theme.Light;
      }
      return Theme.Dark;
    });
  };
  const className = theme === Theme.Dark ? "dark bg-black" : "";

  return (
    <ThemeProvider value={{ theme: theme, setTheme: onSetTheme }}>
      <main className={className}>{children}</main>
    </ThemeProvider>
  );
};

export default Card;
