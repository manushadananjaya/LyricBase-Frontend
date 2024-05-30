import React, { useEffect, useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, View } from "@/components/Themed";
import { StyleSheet, Pressable, FlatList, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/components/types";
import apiClient from "@/services/authService";

type PlaylistDetailsRouteProp = RouteProp<
  RootStackParamList,
  "PlaylistDetails"
>;

interface Song {
  id: number;
  title: string;
  artist: string;
  _id: string;
  pdfKey: string;
}

interface Playlist {
  id: string;
  title: string;
  userPlay: {
    _id: string;
    name: string;
  };
  songIds: string[];
}

const { width, height } = Dimensions.get("window");

export default function PlaylistDetails() {
  const navigation = useNavigation();
  const route = useRoute<PlaylistDetailsRouteProp>();
  const { playlist } = route.params;
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const buttonPressedColorSave = useThemeColor({}, "buttonColorItemsPressed");
  const buttonColorSave = useThemeColor({}, "buttonColorItems");
  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songPromises = playlist.songIds.map((songId: string) =>
          apiClient.get<Song>(`/songs/song/${songId}`)
        );
        const songResponses = await Promise.all(songPromises);
        const fetchedSongs = songResponses.map((response) => response.data);
        setSongs(fetchedSongs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [playlist.songIds]);

  const renderSongItem = ({ item }: { item: Song }) => (
    <Pressable
      style={({ pressed }) => [
        styles.songCard,
        { backgroundColor: pressed ? buttonPressedColorSave : buttonColorSave },
      ]}
      onPress={() => navigation.navigate("SongDetails", { song: item })}
    >
      <Text style={styles.songTitle}>
        {item.title}
        <Text style={styles.songArtist}> {item.artist}</Text>
      </Text>
    </Pressable>
  );

  const handleSavePlaylist = async () => {
    try {
      const response = await apiClient.post(`/playlists/save`, {
        playlistId: playlist.id,
      });
      if (response.status === 200) {
        alert("Playlist saved successfully!");
      } else {
        alert("Failed to save playlist.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving the playlist.");
    }
  };

  const responsiveFontSize = width / 24; // Adjust the divisor to get the desired size

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.titleMain, { fontSize: responsiveFontSize * 1 }]}>
          {playlist.title}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: pressed ? buttonPressedColor : buttonColor,
            },
          ]}
          onPress={handleSavePlaylist}
        >
          <Text
            style={[
              styles.saveButtonText,
              { fontSize: responsiveFontSize * 0.9 },
            ]}
          >
            Save this Playlist
          </Text>
        </Pressable>
      </View>
      <Text style={[styles.user, { fontSize: responsiveFontSize * 0.9 }]}>
        by {playlist.userPlay.name}
      </Text>
      <View style={styles.selectedSongsContainer}>
        <Text style={[styles.subtitle, { fontSize: responsiveFontSize * 0.9 }]}>
          Selected Songs
        </Text>
        <FlatList
          data={songs}
          renderItem={renderSongItem}
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
    paddingTop: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  titleMain: {
    flex: 1,
    fontSize: width * 0.06,
    fontWeight: "bold",
  },
  saveButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: width * 0.04,
  },
  user: {
    fontSize: width * 0.045,
    marginBottom: height * 0.02,
  },
  selectedSongsContainer: {
    width: "100%",
    marginBottom: height * 0.02,
    marginTop: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginBottom: height * 0.01,
  },
  selectedListContent: {
    flexGrow: 1,
    width: "100%",
    paddingBottom: height * 0.01,
  },
  songCard: {
    padding: height * 0.02,
    marginVertical: height * 0.005,
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
  songTitle: {
    fontSize: width * 0.035,
    fontWeight: "bold",
  },
  songArtist: {
    fontSize: width * 0.03,
    color: "#888",
  },
});
