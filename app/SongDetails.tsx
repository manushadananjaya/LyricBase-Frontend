import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Image,
  Animated,
  PanResponder,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/components/types";
import { Text, View } from "@/components/Themed";
import apiClient from "@/services/authService";

type SongDetailsRouteProp = RouteProp<RootStackParamList, "SongDetails">;

export default function SongDetails() {
  const route = useRoute<SongDetailsRouteProp>();
  const { song } = route.params;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const scale = useRef(new Animated.Value(1)).current;
  const initialDistance = useRef(1);
  const initialScale = useRef(1);

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

  console.log("SongDetails -> imageUrl", imageUrl);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        gestureState.numberActiveTouches === 2,
      onPanResponderGrant: (_, gestureState) => {
        if (gestureState.numberActiveTouches === 2) {
          const touch1 = gestureState.touchHistory.touchBank[0];
          const touch2 = gestureState.touchHistory.touchBank[1];
          initialDistance.current = Math.sqrt(
            Math.pow(touch1.currentPageX - touch2.currentPageX, 2) +
              Math.pow(touch1.currentPageY - touch2.currentPageY, 2)
          );
          initialScale.current = 1;
        }
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.numberActiveTouches === 2) {
          const touch1 = gestureState.touchHistory.touchBank[0];
          const touch2 = gestureState.touchHistory.touchBank[1];
          const distance = Math.sqrt(
            Math.pow(touch1.currentPageX - touch2.currentPageX, 2) +
              Math.pow(touch1.currentPageY - touch2.currentPageY, 2)
          );
          const newScale =
            (distance / initialDistance.current) * initialScale.current;
          scale.setValue(newScale);
        }
      },
      onPanResponderRelease: () => {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{song.title}</Text>
      <Text style={styles.artist}>{song.artist}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : imageUrl ? (
        <Animated.View
          style={[styles.imageContainer, { transform: [{ scale }] }]}
          {...panResponder.panHandlers}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
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
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    
  },
});
