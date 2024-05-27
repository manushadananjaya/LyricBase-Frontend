// themeContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";

type ThemeType = "light" | "dark" | "system";

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useSystemColorScheme();
  const [theme, setTheme] = useState<ThemeType>("system");

  const currentTheme = theme === "system" ? systemColorScheme : theme;

  useEffect(() => {
    setTheme(currentTheme as ThemeType);
  }, [systemColorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <NavigationThemeProvider
        value={currentTheme === "dark" ? DarkTheme : DefaultTheme}
      >
        {children}
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
