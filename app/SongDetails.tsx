import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/components/types";
import { Text, View } from "@/components/Themed";
import axios from "axios";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type SongDetailsRouteProp = RouteProp<RootStackParamList, "SongDetails">;

export default function SongDetails() {
  const route = useRoute<SongDetailsRouteProp>();
  const { song } = route.params;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/songs/song/${song._id}/image`
        );
        console.log("Image URL:", response.data.url);
        setImageUrl(response.data.url);
      } catch (error) {
        console.error("Error fetching image URL", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageUrl();
  }, [song._id]);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = withTiming(1);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{song.title}</Text>
        <Text style={styles.artist}>{song.artist}</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : imageUrl ? (
          <GestureDetector gesture={pinchGesture}>
            <Animated.View style={styles.imageContainer}>
              <Animated.Image
                source={{ uri: imageUrl }}
                style={[styles.image, animatedStyle]}
                resizeMode="contain"
              />
            </Animated.View>
          </GestureDetector>
        ) : (
          <Text>No Image available</Text>
        )}
      </View>
    </GestureHandlerRootView>
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
    textAlign: "center",
  },
  artist: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  imageContainer: {
    width: "100%",
    height: 300, // Adjust the height as needed
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
