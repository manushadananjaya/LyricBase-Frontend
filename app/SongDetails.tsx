import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator, Image } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/components/types";
import { Text, View } from "@/components/Themed";
import axios from "axios";

type SongDetailsRouteProp = RouteProp<RootStackParamList, "SongDetails">;

export default function SongDetails() {
  const route = useRoute<SongDetailsRouteProp>();
  const { song } = route.params;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/songs/song/${song._id}/image`
        );
        console.log("response", response.data.url);
        setImageUrl(response.data.url);
      } catch (error) {
        console.error("Error fetching image URL", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageUrl();
  }, [song._id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{song.title}</Text>
      <Text style={styles.artist}>{song.artist}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
