import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  ImageBackground,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  ActivityIndicator,
} from "react-native";
import useLogin from "@/hooks/useLogin";
import { Stack, router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

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

  const buttonColor = "#6200ee";
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
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={require("../../assets/images/guitar2.jpg")}
        style={styles.background}
      >
        <Text style={styles.welcomeTitle}>Welcome Back!</Text>
        <View style={styles.bottomPanel}>
          <Text style={styles.title}>Sign In</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={"#000"}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={"#000"}
          />
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? buttonPressedColor : buttonColor },
            ]}
            onPress={signInAndNavigate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </Pressable>
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity
            style={[styles.forgotButton, { display: error ? "none" : "flex" }]} // Hide the forgot password link if there is an error
            onPress={() => {
              router.push("/(auth)/forgot-password");
            }}
          >
            <Text style={styles.forgotButtonText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => router.push("/(auth)/sign-up")}
          >
            <Text style={styles.signupText}>
              Don't have an account? Register
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    position: "absolute",
    top: "30%",
  },
  bottomPanel: {
    width: "100%",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 60,
    position: "absolute",
    bottom: 0,
  },
  title: {
    fontSize: 30,
    fontFamily: "-Bold",
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
    fontFamily: "-Regular",
    
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
    fontFamily: "-Regular",
  },
  forgotButton: {
    marginTop: 5,
  },
  forgotButtonText: {
    color: "blue",
    fontSize: 14,
    fontFamily: "-Regular",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  signupText: {
    color: "#6200ee",
    fontSize: 16,
    // marginTop: 10,
    fontFamily: "-Regular",
  },
  signupLink: {
    marginTop: 15,
  },
});

export default SignIn;
