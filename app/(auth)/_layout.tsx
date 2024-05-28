import React from "react";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={{ title: "Sign In", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="sign-up"
        options={{ title: "Sign Up", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{ title: "Forgot Password", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="otp-verify"
        options={{ title: "OTP Verify", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="password-reset"
        options={{ title: "Password Reset", headerBackTitle: "Back" }}
      />
    </Stack>
  );
}
