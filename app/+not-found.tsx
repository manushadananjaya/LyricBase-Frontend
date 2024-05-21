// screens/AuthLoadingScreen.js
import React, { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/hooks/useAuthContext"; // Adjust the path as necessary

const AuthLoadingScreen = () => {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    console.log("Loading:", loading, "User:", user);
    if (!loading) {
      if (user) {
        router.replace("/Home"); // Navigate to home screen if signed in
      } else {
        router.replace("/sign-in"); // Navigate to sign-in screen if not signed in
      }
    }
  }, [loading, user]);


  // Show a loading indicator while checking auth status
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AuthLoadingScreen;
