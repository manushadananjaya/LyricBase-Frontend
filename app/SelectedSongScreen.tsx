import React, { useEffect, useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, View } from "@/components/Themed";
import { StyleSheet, Pressable, FlatList, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/types";
import apiClient from "@/services/authService";

type SelectedSongsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SelectedSongs"
>;

interface Song {
  id: number;
  title: string;
  artist: string;
  _id: string;
}

interface RouteParams {
  playlistId: string;
  isEditable: boolean;
}

export default function SelectedSongsScreen() {
  const route = useRoute();
  const { playlistId, isEditable } = route.params as RouteParams;
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [playlistName, setPlaylistName] = useState("");
  const navigation = useNavigation<SelectedSongsScreenNavigationProp>();
  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");
  const buttonColorItems = useThemeColor({}, "buttonColorItems");
  const buttonPressedColorItems = useThemeColor({}, "buttonColorItemsPressed");

  useEffect(() => {
    apiClient
      .get(`/playlists/${playlistId}`)
      .then((response) => {
        setPlaylistName(response.data.title);
        setSelectedSongs(response.data.songs);
      })
      .catch((error) => console.error(error));
  }, [playlistId]);

  const renderSelectedSong = ({ item }: { item: Song }) => (
    <Pressable
      style={({ pressed }) => [
        styles.selectedCard,
        {
          backgroundColor: pressed ? buttonPressedColorItems : buttonColorItems,
        },
      ]}
      onPress={() => navigation.navigate("SongDetails", { song: item })}
    >
      <Text style={styles.selectedTitle}>
        {item.title}
        <Text style={styles.selectedArtist}> {item.artist}</Text>
      </Text>
    </Pressable>
  );

  const { width, height } = Dimensions.get("window");
  const responsiveFontSize = width / 24; // Adjust the divisor to get the desired size

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[styles.titleMain, { fontSize: responsiveFontSize * 1 }]}
        >
          {playlistName}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.editButton,
            {
              backgroundColor: pressed ? buttonPressedColor : buttonColor,
            },
          ]}
          onPress={() =>
            navigation.navigate("EditPlaylist", { playlistId, isEditable })
          }
        >
          <Text
            style={[
              styles.editButtonText,
              { fontSize: responsiveFontSize * 0.9 },
            ]}
          >
            Edit this Playlist
          </Text>
        </Pressable>
      </View>
      <View style={styles.selectedSongsContainer}>
        <Text style={[styles.subtitle, { fontSize: responsiveFontSize * 0.9 }]}>
          Selected Songs
        </Text>
        <FlatList
          data={selectedSongs}
          renderItem={renderSelectedSong}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.selectedListContent}
          style={{ maxHeight: height * 0.7 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleMain: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  selectedSongsContainer: {
    width: "100%",
    marginBottom: 20,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  selectedListContent: {
    flexGrow: 1,
    width: "100%",
    paddingBottom: 10,
  },
  selectedCard: {
    padding: 15,
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
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  selectedArtist: {
    fontSize: 12,
    color: "#888",
  },
});
