import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../components/types"; // Assuming you have defined your RootStackParamList in a types file
import { router } from "expo-router";

type WelcomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

const WelcomeScreen: React.FC<Props> = () => {
  return (
    <ImageBackground
      source={require("../assets/images/guitar1.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.title2}>Sing</Text>
        <Text style={styles.title3}>Share</Text>
        <View style={styles.bottomPanel}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(auth)/sign-up")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text style={styles.loginText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
    width: "100%",
  },
  title: {
    fontSize: 68,
    fontWeight: "bold",
    color: "#fff",
    // fontFamily: '-Bold',
    marginBottom: 10,
  },
  title2: {
    fontSize: 68,
    fontWeight: "bold",
    color: "#fff",
    // fontFamily: '-Bold',
    marginBottom: 10,
  },
  title3: {
    fontSize: 68,
    fontWeight: "bold",
    color: "#fff",
    // fontFamily: '-Bold',
    marginBottom: 30,
  },
  bottomPanel: {
    width: "100%",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 60,
    position: "absolute",
    bottom: 0,
  },
  button: {
    backgroundColor: "#6200ee",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: '-Regular',
  },
  loginLink: {
    marginTop: 10,
  },
  loginText: {
    color: "#ffffff",
    fontSize: 16,
    // fontFamily: '-Regular',
  },
});

export default WelcomeScreen;
