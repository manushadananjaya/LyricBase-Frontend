import React, { useState, useEffect } from "react";
import { StyleSheet, Pressable } from "react-native";
import useLogin from "@/hooks/useLogin";
import { Stack, router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, View, TextInput } from "@/components/Themed";

const SignIn: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSignIn,
    clearError,
  } = useLogin();
  const [clearErrorTimeout, setClearErrorTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");

  useEffect(() => {
    if (error && clearErrorTimeout === null) {
      const timeout = setTimeout(() => {
        clearError();
        setClearErrorTimeout(null);
      }, 3000); // 3 seconds
      setClearErrorTimeout(timeout);
    }
  }, [error, clearErrorTimeout]);

  const signInAndNavigate = async () => {
    clearError();
    const response = await handleSignIn();
    if (response.success) {
      router.replace("/(tabs)/Home");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerLeft: () => null }} />
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? buttonPressedColor : buttonColor },
          ]}
          onPress={signInAndNavigate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>
        {error && <Text style={styles.error}>{error}</Text>}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? buttonPressedColor : buttonColor },
          ]}
          onPress={() => {
            router.push("/(auth)/sign-up");
          }}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.forgotButton,
            { backgroundColor: pressed ? "transparent" : "transparent" },
          ]}
          onPress={() => {
            router.push("/(auth)/forgot-password");
          }}
        >
          <Text style={styles.forgotButtonText}>Forgot Password?</Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  forgotButton: {
    marginTop: 10,
  },
  forgotButtonText: {
    color: "blue",
    fontSize: 14,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default SignIn;
