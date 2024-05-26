import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  View,
  TextInput,
  Text,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/types";
import apiClient from "@/services/authService";

type EditPlaylistScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EditPlaylist"
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

export default function EditPlaylistScreen() {
  const route = useRoute();
  const { playlistId, isEditable } = route.params as RouteParams;
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const navigation = useNavigation<EditPlaylistScreenNavigationProp>();

  useEffect(() => {
    apiClient
      .get(`/playlists/${playlistId}`)
      .then((response) => {
        setPlaylistName(response.data.title);
        setSelectedSongs(response.data.songs);
      })
      .catch((error) => console.error(error));
  }, [playlistId]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setLoading(true);
      apiClient
        .get<Song[]>(`/songs`, {
          params: { search: searchQuery },
        })
        .then((response) => setSongs(response.data))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    } else {
      setSongs([]);
    }
  }, [searchQuery]);

  const handleSavePlaylist = () => {
    const playlistData = {
      title: playlistName,
      songs: selectedSongs.map((song) => song._id),
    };

    const request = isEditable
      ? apiClient.put(`/playlists/${playlistId}`, playlistData)
      : apiClient.post(`/playlists`, playlistData);

    request
      .then(() => navigation.navigate("Playlists"))
      .catch((error) => console.error(error));
  };

  const handleSelectSong = (song: Song) => {
    setSelectedSongs((prev) =>
      prev.find((s) => s._id === song._id)
        ? prev.filter((s) => s._id !== song._id)
        : [...prev, song]
    );
  };

  const renderItem = ({ item }: { item: Song }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: pressed ? "#ddd" : "#fff" },
      ]}
      onPress={() => handleSelectSong(item)}
    >
      <Text style={styles.title}>
        {item.title}
        <Text style={styles.artist}> {item.artist}</Text>
      </Text>
      {selectedSongs.find((song) => song._id === item._id) && (
        <Text style={styles.added}>Added</Text>
      )}
    </Pressable>
  );

  const renderSelectedSong = ({ item }: { item: Song }) => (
    <View style={styles.selectedCard}>
      <Text style={styles.selectedTitle}>
        {item.title}
        <Text style={styles.selectedArtist}> {item.artist}</Text>
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleMain}>Edit Playlist</Text>
        <Pressable style={styles.saveButton} onPress={handleSavePlaylist}>
          <Text style={styles.saveButtonText}>
            {isEditable ? "Save" : "Save as New Playlist"}
          </Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.playlistNameInput}
        placeholder="Playlist Name"
        value={playlistName}
        onChangeText={setPlaylistName}
      />

      <TextInput
        style={styles.searchBar}
        placeholder="Search songs"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={songs}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
        />
      )}

      <View style={styles.selectedSongsContainer}>
        <Text style={styles.subtitle}>Selected Songs</Text>
        <FlatList
          data={selectedSongs}
          renderItem={renderSelectedSong}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
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
  playlistNameInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#fff",
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
  searchBar: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  listContent: {
    flexGrow: 1,
    width: "100%",
  },
  selectedListContent: {
    flexGrow: 0,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedCard: {
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
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 14,
    color: "#888",
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  selectedArtist: {
    fontSize: 12,
    color: "#888",
  },
  added: {
    color: "green",
    fontWeight: "bold",
  },
});
