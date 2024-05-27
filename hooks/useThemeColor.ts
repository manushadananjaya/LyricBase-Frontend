// useThemeColor.ts
import { useContext } from "react";
import { useColorScheme as _useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { ThemeContext } from "@/context/themeContext";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { theme } = useContext(ThemeContext);
  const colorScheme = theme === "system" ? _useColorScheme() : theme;
  const colorFromProps = props[colorScheme ?? "light"];

  return colorFromProps
    ? colorFromProps
    : Colors[colorScheme ?? "light"][colorName];
}
