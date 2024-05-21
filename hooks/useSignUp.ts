import { useState } from "react";
import axios from "axios";
import { Alert } from "react-native";
import { useAuthContext } from "./useAuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SignUpResponse {
  success: boolean;
  message?: string;
}

const useSignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useAuthContext();

  const handleSignUp = async (): Promise<SignUpResponse> => {
    setLoading(true);

    // Check if all fields are filled
    if (!name || !email || !password || !confirmPassword) {
      const message = "Please fill all fields";
      setError(message);
      setLoading(false);
      return { success: false, message };
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      const message = "Passwords do not match";
      setError(message);
      setLoading(false);
      return { success: false, message };
    }
    

    try {
      const response = await axios.post("http://localhost:3000/auth/signup", {
        name,
        email,
        password,
      });

      if (response.status === 201 && response.data) {
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
        dispatch({ type: "LOGIN", payload: response.data });

        Alert.alert("Signup successful");
        return { success: true };
      } else {
        const message = "Signup failed";
        setError(message);
        return { success: false, message };
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Signup error";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
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
  };
};

export default useSignUp;
