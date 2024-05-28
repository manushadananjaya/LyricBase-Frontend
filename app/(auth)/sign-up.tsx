import React, { useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  ImageBackground,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ActivityIndicator,
} from "react-native";
import useSignUp from "@/hooks/useSignUp";
import { Stack, router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

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

  const buttonColor = "#6200ee";
  const buttonPressedColor = useThemeColor({}, "buttonPressed");

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
      router.replace("/(tabs)/Home");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerLeft: () => null }} />
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={require("../../assets/images/welcome.jpg")}
        style={styles.background}
      ></ImageBackground>
      <Text style={styles.welcomeTitle}>Welcome!</Text>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholderTextColor={"#000"}
        />
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
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor={"#000"}
        />
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? buttonPressedColor : buttonColor },
          ]}
          onPress={signUpAndNavigate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </Pressable>
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push("/(auth)/sign-in")}
        >
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 52,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    position: "absolute",
    top: "30%",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 60,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  title: {
    fontSize: 30,
    marginTop: 20,
    fontFamily: "Montserrat-Bold",
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
    fontFamily: "Montserrat-Regular",
  },
  buttonSecondary: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  buttonSecondaryText: {
    color: "#6200ee",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  loginLink: {
    marginTop: 10,
  },
  loginText: {
    color: "#6200ee",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
});

export default SignUp;
