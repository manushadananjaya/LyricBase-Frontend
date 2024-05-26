import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, FlatList, View, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/components/types";
import apiClient from "@/services/authService";
// import { useAuthContext } from "@/hooks/useAuthContext";

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

export default function PlaylistDetails() {
  const navigation = useNavigation();
  const route = useRoute<PlaylistDetailsRouteProp>();
  const { playlist } = route.params;
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
//   const { user } = useAuthContext();

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
      style={styles.songCard}
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleMain}>{playlist.title}</Text>
        <Pressable style={styles.saveButton} onPress={handleSavePlaylist}>
          <Text style={styles.saveButtonText}>Save this Playlist</Text>
        </Pressable>
      </View>
      <Text style={styles.user}>by {playlist.userPlay.name}</Text>
      <View style={styles.selectedSongsContainer}>
        <Text style={styles.subtitle}>Selected Songs</Text>
        <FlatList
          data={songs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.selectedListContent}
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
    backgroundColor: "#f7f7f7",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleMain: {
    fontSize: 24,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  user: {
    fontSize: 18,
    marginBottom: 20,
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
  },
  songCard: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    marginRight: 10,
    borderRadius: 10,
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
    fontSize: 14,
    fontWeight: "bold",
  },
  songArtist: {
    fontSize: 12,
    color: "#888",
  },
});
