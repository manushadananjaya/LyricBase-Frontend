import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import { useThemeColor } from "@/components/Themed";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/types";
import apiClient from "@/services/authService";

type SearchScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Search"
>;

interface Song {
  id: number;
  title: string;
  artist: string;
  _id: string;
  pdfKey: string;
}

interface Playlist {
  title: ReactNode;
  id: number;
  name: string;
  createdBy: string;
  _id: string;
}

export default function Search() {
  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"name" | "artist" | "playlist">("name");
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<SearchScreenNavigationProp>();

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setLoading(true);
      if (filter === "playlist") {
        // console.log("searching playlists");
        apiClient
          .get<Playlist[]>(`playlists/playlist/search`, {
            params: { search: searchQuery, filter },
          })
          .then((response) => setPlaylists(response.data))
          .catch((error) => console.error(error))
          .finally(() => setLoading(false));
      } else {
        apiClient
          .get<Song[]>(`/songs/song`, {
            params: { search: searchQuery, filter },
          })
          .then((response) => setSongs(response.data))
          .catch((error) => console.error(error))
          .finally(() => setLoading(false));
      }
    } else {
      setSongs([]);
      setPlaylists([]);
    }
  }, [searchQuery, filter]);

  console.log( playlists);

  const renderSongItem = ({ item }: { item: Song }) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: pressed ? buttonPressedColor : buttonColor },
      ]}
      onPress={() => navigation.navigate("SongDetails", { song: item })}
    >
      <Text style={styles.title}>
        {item.title}
        <Text style={styles.artist}> {item.artist}</Text>
      </Text>
    </Pressable>
  );

  const renderPlaylistItem = ({ item }: { item: Playlist }) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: pressed ? buttonPressedColor : buttonColor },
      ]}
      onPress={() => navigation.navigate("PlaylistDetails", { playlist: item })}
    >
      <Text style={styles.title}>
        {item.title}
        <Text style={styles.artist}> by {item.name}</Text>
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titleSearch}>Search Songs and Playlists</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search songs by name, artist or playlists"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.filterContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.filterButton,
            { backgroundColor: pressed ? buttonPressedColor : buttonColor },
            filter === "name" && styles.activeFilter,
          ]}
          onPress={() => setFilter("name")}
        >
          <Text style={styles.filterText}>By Name</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.filterButton,
            { backgroundColor: pressed ? buttonPressedColor : buttonColor },
            filter === "artist" && styles.activeFilter,
          ]}
          onPress={() => setFilter("artist")}
        >
          <Text style={styles.filterText}>By Artist</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.filterButton,
            { backgroundColor: pressed ? buttonPressedColor : buttonColor },
            filter === "playlist" && styles.activeFilter,
          ]}
          onPress={() => setFilter("playlist")}
        >
          <Text style={styles.filterText}>By Playlist</Text>
        </Pressable>
      </View>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filter === "playlist" ? playlists : songs}
          renderItem={
            filter === "playlist" ? renderPlaylistItem : renderSongItem
          }
          keyExtractor={(item, index) => `${item.id}-${index}`}
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
  titleSearch: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchBar: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
  },
  activeFilter: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  filterText: {
    fontSize: 16,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "80%",
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
    marginHorizontal: 0,
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
  cardPressed: {
    opacity: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 16,
    color: "#888",
  },
});
