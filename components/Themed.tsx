import React from "react";
import {
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor"; // Adjust the path if needed

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, placeholderTextColor, ...otherProps } =
    props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const placeholderColor = useThemeColor(
    { light: placeholderTextColor as string, dark: placeholderTextColor as string },
    "placeholder"
  );

  return (
    <DefaultTextInput
      style={[{ color }, style]}
      placeholderTextColor={placeholderColor}
      {...otherProps}
    />
  );
}
