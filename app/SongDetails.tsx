import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/components/types";

type SongDetailsRouteProp = RouteProp<RootStackParamList, "SongDetails">;

export default function SongDetails() {
  const route = useRoute<SongDetailsRouteProp>();
  const { song } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{song.title}</Text>
      <Text style={styles.artist}>{song.artist}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 18,
    marginTop: 10,
  },
});
