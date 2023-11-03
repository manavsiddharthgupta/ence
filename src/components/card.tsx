"use client";
import { Theme, ThemeProvider } from "@/context/theme";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

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
  const className =
    theme === Theme.Dark ? " dark bg-zinc-900 w-full" : " w-full";

  return (
    <ThemeProvider value={{ theme: theme, setTheme: onSetTheme }}>
      <body className={className}>
        <nav className="border-r-2 dark:border-zinc-800/90 border-zinc-200/90 border-white bg-zinc-50 dark:bg-zinc-900 w-56 h-screen px-4 py-8 dark:text-white fixed left-0 top-0">
          <h1 className="font-bold text-lg text-center">ENCE</h1>
          <Switch
            onCheckedChange={onSetTheme}
            className="absolute bottom-4 left-8"
          />
        </nav>
        <main className="ml-56 px-4 py-8 min-h-screen dark:text-white overflow-x-auto">
          {children}
        </main>
      </body>
    </ThemeProvider>
  );
};

export default Card;
