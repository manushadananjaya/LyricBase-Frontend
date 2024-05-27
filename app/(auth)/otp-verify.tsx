import React, { useState, useEffect } from "react";
import { StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, View, TextInput } from "@/components/Themed";
import apiClient from "@/services/authService";
import { RouteProp, useRoute } from "@react-navigation/native";

type RootStackParamList = {
  "otp-verify": { email: string };
};

type EnterOtpRouteProp = RouteProp<RootStackParamList, "otp-verify">;

const EnterOtp: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);

  const route = useRoute<EnterOtpRouteProp>();
  const email = route.params.email;
  const router = useRouter();

  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (resendDisabled) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 60;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [resendDisabled]);

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("OTP is required");
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post("/auth/verifyOtp", {
        email,
        otp,
      });
      if (response.status === 200 && response.data.message === "OTP-verified") {
        router.replace({
          pathname: "/(auth)/password-reset",
          params: { email },
        });
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setResendDisabled(true);

    try {
      const response = await apiClient.post("/auth/sendOtp", { email });
      if (response.status !== 200) {
        setError(response.data.message);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || error.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Enter OTP" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? buttonPressedColor : buttonColor },
          ]}
          onPress={handleVerifyOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify OTP</Text>
          )}
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: resendDisabled
                ? "gray"
                : pressed
                ? buttonPressedColor
                : buttonColor,
            },
          ]}
          onPress={handleResendOtp}
          disabled={resendDisabled}
        >
          {resendLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Resend OTP {resendDisabled ? `(${countdown}s)` : ""}
            </Text>
          )}
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

export default EnterOtp;
