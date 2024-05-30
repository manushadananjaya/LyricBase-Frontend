import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/components/types";
import apiClient from "@/services/authService";

type ArtistDetailsRouteProp = RouteProp<RootStackParamList, "ArtistDetails">;

interface Song {
  id: number;
  title: string;
  artist: string;
  _id: string;
}

const { width, height } = Dimensions.get("window");

export default function ArtistDetails() {
  const buttonColor = useThemeColor({}, "buttonColorItems");
  const buttonPressedColor = useThemeColor({}, "buttonColorItemsPressed");
  const route = useRoute<ArtistDetailsRouteProp>();
  const { artist } = route.params;
  const [artistSongs, setArtistSongs] = useState<Song[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    apiClient
      .get(`/artists/${artist}`)
      .then((response: AxiosResponse<Song[]>) => {
        setArtistSongs(response.data);
      })
      .catch((error) => console.error(error));
  }, [artist]);

  const responsiveFontSize = width / 24; // Adjust the divisor to get the desired size
  const responsivePadding = width / 40; // Adjust the divisor to get the desired padding

  const renderItem = ({
    item,
  }: {
    item: { id: number; title: string; artist: string };
  }) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: pressed ? buttonPressedColor : buttonColor,
          padding: responsivePadding,
        },
      ]}
      onPress={() => navigation.navigate("SongDetails", { song: item })}
    >
      <Text
        style={[styles.title, { fontSize: responsiveFontSize * 0.9 }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.title}
      </Text>
      <Text
        style={[styles.artist, { fontSize: responsiveFontSize * 0.75 }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.artist}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text
        style={[styles.header, { fontSize: responsiveFontSize * 1.5 }]}
      >
        {artist}'s Songs
      </Text>
      <FlatList
        data={artistSongs}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  header: {
    fontFamily: "Montserrat-Bold",
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: "5%",
    left: "5%",
    // color: "black",
  },
  card: {
    marginVertical: 5,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    height: 70, // Set a fixed height for consistency
    justifyContent: "center", // Center content vertically
  },
  title: {
    fontWeight: "bold",
  },
  artist: {
    color: "#888",
  },
});

export default ArtistDetails;
