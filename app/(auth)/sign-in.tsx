import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";

interface SignInProps {}

const SignIn: React.FC<SignInProps> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      // Send a POST request to your backend server for user authentication
      const response = await axios.post("http://localhost:3000/auth/signin", {
        email,
        password,
      });

      // Assuming your backend returns a success message or status code
      if (response.data.success) {
        // Sign in successful, navigate to another screen or perform other actions
        console.log("Sign in successful");
        // Navigate to the home screen (or any other desired screen)
        router.replace("/tabs");
      } else {
        // Sign in failed, display an error message
        console.log("Sign in failed");
        // Optionally, you can display an error message to the user
      }
    } catch (error) {
      console.error("Sign in error:", error);
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
      <Button title="Sign In" onPress={handleSignIn} />

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
});

export default SignIn;
