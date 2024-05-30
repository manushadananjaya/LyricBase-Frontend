import { useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "react-native";
import { useAuthContext } from "./useAuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/services/authService";

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
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const { dispatch } = useAuthContext();

  const checkUsernameAvailability = async (username: string) => {
    try {
      if (
        username.length < 4 ||
        !/^[a-zA-Z0-9_]*$/.test(username) ||
        username.includes(" ")
      ) {
        setError(
          "Username must be at least 4 characters long and can only contain letters, numbers, and underscores"
        );
        setIsUsernameAvailable(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/auth/checkUsername/${username}`);
      
      if (response.status === 200 && username.length > 4) {
        setIsUsernameAvailable(true);
        setError(null);
      }
      else if (username.length < 4) {
        setError("Username must be at least 4 characters long");
      }
      
    } catch (error: any) {
      setError(error.response?.data?.error || "Username check error");
      setIsUsernameAvailable(null);
    }
  };

  
  console.log(isUsernameAvailable);
  

  useEffect(() => {
    if (name.length > 0) {
      checkUsernameAvailability(name);
    }
  }, [name]);

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

    // Check if password is at least 8 characters
    if (password.length < 8) {
      const message = "Password must be at least 8 characters long";
      setError(message);
      setLoading(false);
      return { success: false, message };
    }

    // Check if name is longer than 4 characters and doesn't contain special characters or spaces
    if (name.length < 4 || !/^[a-zA-Z0-9_]*$/.test(name) || name.includes(" ")){
      const message = "Username must be at least 4 characters long and can only contain letters, numbers, and underscores";
      setError(message);
      setLoading(false);
      return { success: false, message };
    }
    

    // Check if username is available
    if (isUsernameAvailable === false) {
      const message = "Username is already taken";
      setError(message);
      setLoading(false);
      return { success: false, message };
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, {
        name,
        email,
        password,
      });

      if (response.status === 201 && response.data) {
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
        dispatch({ type: "LOGIN", payload: response.data });

        // Alert.alert("Signup successful");
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
    isUsernameAvailable,
  };
};

export default useSignUp;
