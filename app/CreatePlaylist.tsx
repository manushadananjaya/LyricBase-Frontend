import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/types";
// Get user from context
import { useAuthContext } from "@/hooks/useAuthContext";
import apiClient from "@/services/authService";


type CreatePlaylistScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CreatePlaylist"
>;

interface Song {
  id: number;
  title: string;
  artist: string;
  _id: string;
}

export default function CreatePlaylistScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const navigation = useNavigation<CreatePlaylistScreenNavigationProp>();

  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");

  // Get user from context
  // const { user } = useAuthContext();

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
      songs: selectedSongs,
      // user: user.user._id,
    };

    apiClient
      .post(`/playlists/`, playlistData)
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
        { backgroundColor: pressed ? buttonPressedColor : buttonColor },
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleMain}>Create Playlist</Text>
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            { backgroundColor: pressed ? buttonPressedColor : buttonColor },
          ]}
          onPress={handleSavePlaylist}
        >
          <Text style={styles.saveButtonText}>Save Playlist</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
    paddingHorizontal: 20,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  titleMain: {
    fontSize: 28,
    fontWeight: "bold",
  },
  playlistNameInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  searchBar: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  listContent: {
    flexGrow: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 10,
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 16,
    color: "#888",
  },
  added: {
    color: "green",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
