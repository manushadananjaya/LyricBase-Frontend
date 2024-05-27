import React, { useState } from "react";
import { StyleSheet, Pressable, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, View, TextInput } from "@/components/Themed";
import apiClient from "@/services/authService";
import { PartialRoute, Route, RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";

// Define navigation parameter types
type RootStackParamList = {
  "reset-password": { email: string };
};

type ResetPasswordRouteProp = RouteProp<RootStackParamList, "reset-password">;

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const route = useRoute<ResetPasswordRouteProp>();
  const email = route.params.email;
  const router = useRouter();

  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");

    const navigation = useNavigation();

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password === "") {
      setError("Password cannot be empty.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await apiClient.put("/auth/resetPassword", {
        email,
        password,
      });
      if (response.status === 200) {
        Alert.alert("Password reset successfully");
        navigation.reset({
        index: 0,
        routes: [
          { name: "(auth)" } as PartialRoute<Route<never, object | undefined>>,
        ],
      });
        
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      console.log(
        "Reset password error: ",
        error.response?.data?.error || error.message
      );
      setError(error.response?.data?.error || error.message);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Reset Password" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? buttonPressedColor : buttonColor },
          ]}
          onPress={handleResetPassword}
        >
          <Text style={styles.buttonText}>Reset Password</Text>
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
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default ResetPassword;
