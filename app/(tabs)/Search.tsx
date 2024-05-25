import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import { useThemeColor } from "@/components/Themed";
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
  _id: string;
  title: string;
  user: string;
  songs: string[];
}

interface User {
  _id: string;
  name: string;
}

export default function Search() {
  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"name" | "artist" | "playlist">("name");
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [userDetails, setUserDetails] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<SearchScreenNavigationProp>();

  useEffect(() => {
    const fetchUserDetails = async (userIds: string[]) => {
      try {
        const uniqueUserIds = [...new Set(userIds)];
        const userDetailPromises = uniqueUserIds.map((userId) =>
          apiClient.get<User>(`/users/${userId}`)
        );
        const userDetailResponses = await Promise.all(userDetailPromises);
        const userDetailsMap = userDetailResponses.reduce(
          (acc, response) => ({
            ...acc,
            [response.data._id]: response.data,
          }),
          {}
        );
        setUserDetails(userDetailsMap);
      } catch (error) {
        console.error(error);
      }
    };

    if (searchQuery.trim().length > 0) {
      setLoading(true);
      if (filter === "playlist") {
        apiClient
          .get<{ playlists: Playlist[] }>(`/playlists/playlist/search`, {
            params: { search: searchQuery, filter },
          })
          .then((response) => {
            const playlists = response.data.playlists || [];
            setPlaylists(playlists);
            const userIds = playlists.map((playlist) => playlist.user);
            fetchUserDetails(userIds);
          })
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

  const renderSongItem = ({ item }: { item: Song }) => (
    <Pressable
      key={item._id}
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

  const renderPlaylistItem = ({ item }: { item: Playlist }) => {
    const user = userDetails[item.user] || { name: "Loading..." };
    return (
      <Pressable
        key={item._id}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: pressed ? buttonPressedColor : buttonColor },
        ]}
        onPress={() =>
          navigation.navigate("PlaylistDetails", {
            playlist: {
              id: item._id,
              title: item.title,
              userPlay: {
                _id: item.user,
                name: user.name,
              },
              songIds: item.songs,
            },
          })
        }
      >
        <Text style={styles.title}>
          {item.title}
          <Text style={styles.artist}> by {user.name}</Text>
        </Text>
      </Pressable>
    );
  };

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
          keyExtractor={(item, index) => `${item._id}-${index}`} // Ensure unique keys
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
    height: 1,
    width: "100%",
    marginBottom: 20,
  },
  listContent: {
    width: "100%",
  },
  card: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 16,
    color: "#888",
  },
});
