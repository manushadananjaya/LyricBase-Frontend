import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
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
        <Text style={styles.title}>{song.title}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.getChordsButton,
            { backgroundColor: pressed ? buttonPressedColor : buttonColor},
          ]}
          onPress={handleGetChords}
        >
          <Text style={styles.getChordsButtonText}>Get Chords</Text>
        </Pressable>
      </View>
      <Text style={styles.artist}>{song.artist}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : imageUrl ? (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          maximumZoomScale={3}
          minimumZoomScale={1}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          centerContent={true}
          style={styles.scrollContainerImage}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </ScrollView>
      ) : (
        <Text>No Image available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: "5%",
  },
  getChordsButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#0000ff",
  },
  getChordsButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  artist: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.6,
    aspectRatio: 1,
  },
  scrollContainerImage: {
    width: "100%",
    height: "100%",
    alignContent: "center",
  },
});
