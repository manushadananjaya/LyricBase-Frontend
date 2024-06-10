// RootLayout.tsx
import React, { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider } from "@/context/themeContext";
import { AuthContextProvider } from "@/context/authContext";
import { Stack } from "expo-router";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    CurierNew: require("../assets/fonts/cour.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthContextProvider>
          <RootLayoutNav />
        </AuthContextProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="Index" />
      <Stack.Screen name="Profile" options={{ presentation: "modal" }} />
      <Stack.Screen name="SongDetails" options={{ headerBackTitle: "Back" }} />
      <Stack.Screen
        name="ArtistDetails"
        options={{ headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="CreatePlaylist"
        options={{ headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="EditPlaylist"
        options={{ headerBackTitle: "Selected Songs" }}
      />
      <Stack.Screen
        name="SelectedSongScreen"
        options={{ title: "Selected Songs", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="PlaylistDetails"
        options={{ headerBackTitle: "Back" }}
      />
      <Stack.Screen name="WelcomeScreen" options={{ headerShown: false }} />
      <Stack.Screen 
        name="ChordsDetails"
        options={{ headerBackTitle: "Back" }}
      />
      <Stack.Screen name="OfflineDownloads" options={{ headerBackTitle: "Back" }} />
    </Stack>
  );
}
