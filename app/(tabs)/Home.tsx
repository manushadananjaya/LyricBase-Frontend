import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import FeatureCard from "@/components/homeScreen/FeatureCard";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text } from "@/components/Themed";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Home() {
  const router = useRouter();
  const textMain = useThemeColor({}, "textMain");
  const profileButtonColor = useThemeColor({}, "profileButton");
  const profileIconColor = useThemeColor({}, "profileIcon");

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/guitarhome.jpg")}
          style={styles.backgroundImage}
        />
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: textMain }]}>LyriCBase</Text>
            <TouchableOpacity
              onPress={() => router.push("/Profile")}
              style={[styles.profileButton, { backgroundColor: profileButtonColor }]}
            >
              <FontAwesome name="user" size={30} color={profileIconColor}/>
            </TouchableOpacity>
          </View>
        <View style={styles.contentContainer}>
          <FeatureCard
            title="Guitar Tuner"
            content="Tune your Guitar from your phone microphone Certified by Kreez Studios "
            onPress={() => console.log("Feature 1 Pressed")}
          />
          <FeatureCard
            title="AI Chords"
            content="Get AI generated chords for your favorite songs"
            onPress={() => console.log("Feature 2 Pressed")}
          />
          <FeatureCard
            title="Offline Mode"
            content="Use the app offline with no internet connection required"
            onPress={() => console.log("Feature 3 Pressed")}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    width: "200%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: 0.8,
    zIndex: -1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  profileButton: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    marginTop: 40,
  },
});
