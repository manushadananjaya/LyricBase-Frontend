import React from "react";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="otp-verify" options={{ headerShown: false }} />
      <Stack.Screen name="password-reset" options={{ headerShown: false }} />
    </Stack>
  );
}
