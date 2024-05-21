import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SignInResponse {
  success: boolean;
  message?: string;
  error?: any;
}

const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useAuthContext();

  const handleSignIn = async (): Promise<SignInResponse> => {
    setLoading(true);

    // Check if email and password are not empty
    if (!email || !password) {
      setError("Please fill all fields");
      setLoading(false);
      return { success: false, message: "Please fill all fields" };
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/signin", {
        email,
        password,
      });

      if (response.status === 200) {
        await AsyncStorage.setItem("user", JSON.stringify(response.data));

        dispatch({ type: "LOGIN", payload: response.data });

        const userFromStorage = await AsyncStorage.getItem("user");
        console.log("user from storage", JSON.parse(userFromStorage || "{}"));

        return { success: true };
      } else {
        setError("Sign in failed");
        return { success: false, message: "Sign in failed" };
      }
    } catch (error: any) {
      console.log(
        "Sign in error: ",
        error.response?.data?.error || error.message
      );
      setError(error.response?.data?.error || error.message);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSignIn,
    clearError,
  };
};

export default useLogin;
