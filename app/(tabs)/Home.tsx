import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
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

  const { width } = Dimensions.get("window");
  const responsiveFontSize = width / 10; // Adjust the divisor to get the desired size
  const responsivePadding = width / 40; // Adjust the divisor to get the desired padding
  const responsiveProfileButtonSize = width / 8;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/peakpx4.jpg")}
          style={styles.backgroundImage}
        />
        <View style={styles.headerContainer}>
          <Text
            style={[
              styles.title,
              { fontSize: responsiveFontSize, color: textMain },
            ]}
          >
            LyriCBase
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/Profile")}
            style={[
              styles.profileButton,
              {
                backgroundColor: profileButtonColor,
                width: responsiveProfileButtonSize,
                height: responsiveProfileButtonSize,
              },
            ]}
          >
            <FontAwesome
              name="user"
              size={responsiveProfileButtonSize / 2}
              color={profileIconColor}
            />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View
            style={[styles.contentContainer, { padding: responsivePadding }]}
          >
            <FeatureCard
              title="Offline Mode"
              content="Use the app offline with no internet connection required"
              onPress={() => router.push("/OfflineDownloads")} // Updated onPress for Offline Mode
            />
            <FeatureCard
              title="Request Lyrics & Chords"
              content="Didn't find the song you were looking for? Request it here!"
              onPress={() => router.push("/RequestLyricsChords")} // Updated onPress for Request Lyrics & Chords
            />
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
            
          </View>
        </ScrollView>
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
    width: "100%",
    height: "110%",
    bottom: 0,
    left: 0,
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
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    marginBottom: 100,
    
    
  },
  title: {
    fontWeight: "bold",
  },
});
