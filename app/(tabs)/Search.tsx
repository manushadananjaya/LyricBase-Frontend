import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Image,
  TextInput,
  Dimensions,
  Platform,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/types";
import apiClient from "@/services/authService";
import { Stack } from "expo-router";
import NetInfo from "@react-native-community/netinfo";

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

const { width, height } = Dimensions.get("window");

export default function Search() {
  const buttonColor = useThemeColor({}, "buttonColorItems");
  const buttonPressedColor = useThemeColor({}, "buttonColorItemsPressed");
  const textInputColor = useThemeColor({}, "textInputColor");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"name" | "artist" | "playlist">("name");
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [userDetails, setUserDetails] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [isOffline, setIsOffline] = useState(false);

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

    const fetchData = async () => {
      if (searchQuery.trim().length > 0) {
        setLoading(true);
        setNoResults(false);
        try {
          if (filter === "playlist") {
            const response = await apiClient.get<Playlist[]>(
              `/playlists/playlist/search`,
              { params: { search: searchQuery, filter } }
            );
            const playlists = response.data || [];
            setPlaylists(playlists);
            if (playlists.length === 0) setNoResults(true);
            const userIds = playlists.map((playlist) => playlist.user);
            await fetchUserDetails(userIds);
          } else {
            const response = await apiClient.get<Song[]>(`/songs/song`, {
              params: { search: searchQuery, filter },
            });
            const songs = response.data || [];
            setSongs(songs);
            if (songs.length === 0) setNoResults(true);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setNoResults(true);
          } else {
            console.error(error);
          }
        } finally {
          setLoading(false);
        }
      } else {
        setSongs([]);
        setPlaylists([]);
        setNoResults(false);
      }
    };

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    fetchData();

    return () => {
      unsubscribe();
    };
  }, [searchQuery, filter]);

  const renderSongItem = ({ item }: { item: Song }) => (
    <Pressable
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

  if (isOffline) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/search2.jpg")}
          style={styles.backgroundImage}
        />
        <Text style={styles.offlineText}>You are in offline mode</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/search2.jpg")}
          style={styles.backgroundImage}
        />
        <Text style={styles.titleSearch}>Search Songs and Playlists</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search songs by name, artist or playlists"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          selectionColor={textInputColor}
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
        ) : noResults ? (
          <Text style={styles.noResultsText}>No results found</Text>
        ) : (
          <FlatList
            data={filter === "playlist" ? playlists : songs}
            renderItem={
              filter === "playlist" ? renderPlaylistItem : renderSongItem
            }
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            style={{ maxHeight: 450 }}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: height * 0.05,
    paddingHorizontal: width * 0.05,
    width: "100%",
  },
  titleSearch: {
    marginTop: height * 0.05,
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    width: "100%",
    textAlign: "center",
  },
  searchBar: {
    width: "100%",
    padding: height * 0.015,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: height * 0.02,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: height * 0.02,
    backgroundColor: "transparent",
  },
  filterButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    borderRadius: 5,
    borderWidth: 1,
  },
  activeFilter: {
    backgroundColor: "#BDB4FE",
    borderColor: "#E0EAFF",
  },
  filterText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    width: "100%",
    marginBottom: height * 0.02,
  },
  listContent: {
    width: "100%",
  },
  card: {
    padding: height * 0.02,
    marginVertical: height * 0.01,
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "-Regular",
  },
  artist: {
    fontSize: 16,
    color: "#888",
  },
  noResultsText: {
    fontSize: 18,
    color: "#888",
  },
  offlineText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF0000",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: height * 0.4,
  },
  backgroundImage: {
    position: "absolute",
    width: "200%",
    height: "180%",
    top: 0,
    left: -30,
    opacity: 0.2,
  },
});
