import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  View,
  Alert,
} from "react-native";
import { Text } from "@/components/Themed";
import { useThemeColor } from "@/hooks/useThemeColor";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/components/types";
import apiClient from "@/services/authService";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Slider from "@react-native-community/slider";
import * as FileSystem from "expo-file-system";
import NetInfo from "@react-native-community/netinfo";

type SongDetailsRouteProp = RouteProp<RootStackParamList, "SongDetails">;

type SongDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SongDetails"
>;

export default function SongDetails() {
  const route = useRoute<SongDetailsRouteProp>();
  const navigation = useNavigation<SongDetailsNavigationProp>();
  const { song } = route.params;
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(16); // default font size
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");

  const SliderMinimumTrackTintColor = useThemeColor(
    {},
    "SliderMinimumTrackTintColor"
  );
  const SliderMaximumTrackTintColor = useThemeColor(
    {},
    "SliderMaximumTrackTintColor"
  );

  const { width } = Dimensions.get("window");
  const responsiveFontSize = width / 24; // Adjust the divisor to get the desired size
  const responsiveButtonPadding = width / 40; // Adjust the divisor to get the desired padding

  useEffect(() => {
    const checkConnectivity = async () => {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        fetchLyrics();
      } else {
        loadOfflineLyrics();
        setIsOffline(true);
      }
    };

    checkConnectivity();
  }, []);

  const fetchLyrics = async () => {
    try {
      const response = await apiClient.get(`/songs/song/${song._id}/lyrics`);
      setLyrics(response.data);
    } catch (error) {
      console.error("Error fetching lyrics", error);
    } finally {
      setLoading(false);
    }
  };

  const loadOfflineLyrics = async () => {
    const dir = `${FileSystem.documentDirectory}songs`;
    console.log("dir", dir);
    const fileUri = `${dir}/${song._id}.json`;
    try {
      // Check if the file exists before trying to read it
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const songData = JSON.parse(fileContent); 
      setLyrics(songData.lyrics);
    } catch (error) {
      console.error("Error reading offline lyrics", error);
      Alert.alert("No downloaded lyrics available.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetChords = () => {
    // Navigate to the Chords screen or perform another action
    navigation.navigate("ChordsDetails", { songId: song._id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[styles.title, { fontSize: responsiveFontSize }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {song.title}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.getChordsButton,
            {
              backgroundColor: pressed ? buttonPressedColor : buttonColor,
              padding: responsiveButtonPadding,
            },
          ]}
          onPress={handleGetChords}
        >
          <Text
            style={[
              styles.getChordsButtonText,
              { fontSize: responsiveFontSize * 0.75 },
            ]}
          >
            Get Chords
          </Text>
        </Pressable>
      </View>
      <Text style={[styles.artist, { fontSize: responsiveFontSize * 0.8 }]}>
        {song.artist}
      </Text>
      <View style={styles.sliderContainer}>
        <Text>Font Size</Text>
        <Slider
          style={styles.slider}
          minimumValue={10}
          maximumValue={30}
          value={fontSize}
          onValueChange={(value) => setFontSize(value)}
          step={1}
          minimumTrackTintColor={SliderMinimumTrackTintColor}
          maximumTrackTintColor={SliderMaximumTrackTintColor}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : lyrics ? (
        <ScrollView style={styles.lyricsContainer}>
          <Text style={[styles.lyrics, { fontSize }]}>{lyrics}</Text>
        </ScrollView>
      ) : (
        <Text>No Lyrics available</Text>
      )}
      {isOffline && <Text style={styles.offlineModeText}>Offline Mode</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    flex: 1, // Ensures title takes up as much space as possible
    marginRight: 10, // Adds some space between the title and the button
  },
  getChordsButton: {
    borderRadius: 5,
  },
  getChordsButtonText: {
    color: "#fff",
  },
  artist: {
    marginVertical: 10,
  },
  sliderContainer: {
    marginVertical: 0,
    alignItems: "center",
  },
  slider: {
    width: "80%",
    height: 40,
  },
  lyricsContainer: {
    flex: 1,
    marginTop: 10,
  },
  lyrics: {
    lineHeight: 24,
    fontFamily: "SpaceMono",
  },
  offlineModeText: {
    color: "red",
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 10,
  },
});
