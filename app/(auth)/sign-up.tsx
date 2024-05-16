import React, { useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import useSignUp from "@/hooks/useSignUp";
import { router } from "expo-router";

const SignUp: React.FC = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSignUp,
    clearError,
    confirmPassword,
    setConfirmPassword,
  } = useSignUp();

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        clearError();
      }, 5000); // Clear error after 5 seconds

      return () => clearTimeout(timeout);
    }
  }, [error, clearError]);

  const signUpAndNavigate = async () => {
    clearError();
    const response = await handleSignUp();
    if (response.success) {
      router.push("/sign-in");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        />
      <Button title="Sign Up" onPress={signUpAndNavigate} disabled={loading} />
      {error && <Text style={styles.error}>{error}</Text>}
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

export default SignUp;
