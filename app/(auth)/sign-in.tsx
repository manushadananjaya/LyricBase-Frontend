import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import useLogin from "@/hooks/useLogin";
import { router } from "expo-router";

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
      router.replace("/(tabs)");
    }
  };

  return (
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

      <Button title="Sign In" onPress={signInAndNavigate} disabled={loading} />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title="Sign Up"
        onPress={() => {
          router.push("/sign-up");
        }}
      />
    </View>
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
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default SignIn;
