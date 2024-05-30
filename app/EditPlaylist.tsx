import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, View, TextInput } from "@/components/Themed";
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
  const buttonColorsave = useThemeColor({}, "button");
  const buttonPressedColorSave = useThemeColor({}, "buttonPressed");
  const selectedSongCardColor = useThemeColor(
    {},
    "editPlaylistSelectedSongCard"
  );

  const buttonColor = useThemeColor({}, "buttonColorItems");
  const buttonPressedColor = useThemeColor({}, "buttonColorItemsPressed");

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
        .get<Song[]>(`/songs/song`, {
          params: { search: searchQuery, filter: "name" },
        })
        .then((response) => setSongs(response.data))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    } else {
      setSongs([]);
    }
  }, [searchQuery]);

  const handleSavePlaylist = () => {
    if (playlistName.trim() === "") {
      Alert.alert("Error", "Playlist name cannot be empty.");
      return;
    }

    if (selectedSongs.length === 0) {
      Alert.alert("Error", "You must select at least one song.");
      return;
    }
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

  const handleRemoveSelectedSong = (song: Song) => {
    setSelectedSongs((prev) => prev.filter((s) => s._id !== song._id));
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

  const renderSelectedSong = ({ item }: { item: Song }) => (
    <Pressable
      style={[
        styles.selectedCard,
        {
          backgroundColor: selectedSongCardColor,
        },
      ]}
      onPress={() => handleRemoveSelectedSong(item)}
    >
      <Text style={styles.selectedTitle}>
        {item.title}
        <Text style={styles.selectedArtist}> {item.artist}</Text>
      </Text>
    </Pressable>
  );

  const { width, height } = Dimensions.get("window");
  const responsiveFontSize = width / 24; // Adjust the divisor to get the desired size
  const responsivePadding = width / 40; // Adjust the divisor to get the desired padding

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[styles.titleMain, { fontSize: responsiveFontSize * 1.5 }]}
        >
          Edit Playlist
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: pressed
                ? buttonPressedColorSave
                : buttonColorsave,
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
            {isEditable ? "Save" : "Save as New Playlist"}
          </Text>
        </Pressable>
      </View>

      <TextInput
        style={[
          styles.playlistNameInput,
          { fontSize: responsiveFontSize * 0.8, padding: responsivePadding },
        ]}
        placeholder="Playlist Name"
        value={playlistName}
        onChangeText={setPlaylistName}
      />

      <TextInput
        style={[
          styles.searchBar,
          { fontSize: responsiveFontSize * 0.8, padding: responsivePadding },
        ]}
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
          style={{ maxHeight: height * 0.4 }}
        />
      )}

      <View style={styles.selectedSongsContainer}>
        <Text style={[styles.subtitle, { fontSize: responsiveFontSize * 0.9 }]}>
          Selected Songs
        </Text>
        <FlatList
          data={selectedSongs}
          renderItem={renderSelectedSong}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectedListContent}
        />
        <Text
          style={[styles.removeHint, { fontSize: responsiveFontSize * 0.7 }]}
        >
          You can remove selected songs by tapping on it
        </Text>
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
    fontSize: 24,
    fontWeight: "bold",
  },
  playlistNameInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
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
  removeHint: {
    fontSize: 12,
    color: "#888",
    marginBottom: 20,
  },
  added: {
    color: "green",
    fontWeight: "bold",
  },
});
