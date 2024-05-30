import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useThemeColor } from "@/hooks/useThemeColor";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/components/types";
import apiClient from "@/services/authService";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import ImageViewer from "react-native-image-zoom-viewer";

type SongDetailsRouteProp = RouteProp<RootStackParamList, "SongDetails">;

type SongDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SongDetails"
>;

export default function SongDetails() {
  const route = useRoute<SongDetailsRouteProp>();
  const navigation = useNavigation<SongDetailsNavigationProp>();
  const { song } = route.params;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");

  const { width, height } = Dimensions.get("window");
  const responsiveFontSize = width / 24; // Adjust the divisor to get the desired size
  const responsiveButtonPadding = width / 40; // Adjust the divisor to get the desired padding

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const response = await apiClient.get(`/songs/song/${song._id}/image`);
        setImageUrl(response.data.url);
      } catch (error) {
        console.error("Error fetching image URL", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageUrl();
  }, [song._id]);

  const handleGetChords = () => {
    // Navigate to the Chords screen or perform another action
    // navigation.navigate("Chords", { songId: song._id });
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : imageUrl ? (
        <View style={styles.imageViewerContainer}>
          <ImageViewer
            imageUrls={[{ url: imageUrl }]}
            backgroundColor="white"
            enableSwipeDown={true}
            onSwipeDown={() => console.log("swiped down")}
            renderIndicator={() => null}
            style={styles.imageViewer}
          />
        </View>
      ) : (
        <Text>No Image available</Text>
      )}
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
  imageViewerContainer: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
  imageViewer: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
});
