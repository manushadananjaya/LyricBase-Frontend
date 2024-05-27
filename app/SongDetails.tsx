import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Image,
  Animated,
  PanResponder,
  GestureResponderEvent,
  ScrollView,
  Dimensions,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useThemeColor } from "@/hooks/useThemeColor";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/components/types";

import apiClient from "@/services/authService";


type SongDetailsRouteProp = RouteProp<RootStackParamList, "SongDetails">;

export default function SongDetails() {
  const route = useRoute<SongDetailsRouteProp>();
  const { song } = route.params;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const scale = useRef(new Animated.Value(1)).current;
  // const initialDistance = useRef(1);
  // const initialScale = useRef(1);

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

  const MAX_SCALE = 3;
  const MIN_SCALE = 1;

  // const panResponder = useRef(
  //   PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onMoveShouldSetPanResponder: (_, gestureState) =>
  //       gestureState.numberActiveTouches === 2,
  //     onPanResponderGrant: (e: GestureResponderEvent, gestureState) => {
  //       if (gestureState.numberActiveTouches === 2) {
  //         const touches = e.nativeEvent.touches;
  //         if (touches.length >= 2) {
  //           const touch1 = touches[0];
  //           const touch2 = touches[1];
  //           initialDistance.current = Math.sqrt(
  //             Math.pow(touch1.pageX - touch2.pageX, 2) +
  //               Math.pow(touch1.pageY - touch2.pageY, 2)
  //           );
  //           initialScale.current = scale._value;
  //         }
  //       }
  //     },
  //     onPanResponderMove: (e: GestureResponderEvent, gestureState) => {
  //       if (gestureState.numberActiveTouches === 2) {
  //         const touches = e.nativeEvent.touches;
  //         if (touches.length >= 2) {
  //           const touch1 = touches[0];
  //           const touch2 = touches[1];
  //           const distance = Math.sqrt(
  //             Math.pow(touch1.pageX - touch2.pageX, 2) +
  //               Math.pow(touch1.pageY - touch2.pageY, 2)
  //           );
  //           let newScale =
  //             (distance / initialDistance.current) * initialScale.current;

  //           // Clamp the newScale value to be within the min and max scale limits
  //           newScale = Math.max(MIN_SCALE, Math.min(newScale, MAX_SCALE));
  //           scale.setValue(newScale);
  //         }
  //       }
  //     },
  //     onPanResponderRelease: () => {
  //       Animated.spring(scale, {
  //         toValue: 1,
  //         useNativeDriver: true,
  //       }).start();
  //     },
  //   })
  // ).current;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{song.title}</Text>
      <Text style={styles.artist}>{song.artist}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : imageUrl ? (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          maximumZoomScale={MAX_SCALE}
          minimumZoomScale={MIN_SCALE}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          centerContent={true}
          style={styles.scrollContainerImage}
        >
          {/* <Animated.View
            style={[styles.imageContainer, { transform: [{ scale }] }]}
            {...panResponder.panHandlers}
          > */}
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          {/* </Animated.View> */}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
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
