import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Text, View } from "@/components/Themed";
import axios from "axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/types";

type PlaylistsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Playlists"
>;

interface Playlist {
  title: any;
  _id: string;
  name: string;
  songs: Song[];
}

export default function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<PlaylistsScreenNavigationProp>();

  const fetchPlaylists = useCallback(() => {
    setLoading(true);
    axios
      .get<Playlist[]>(`http://localhost:3000/playlists/`)
      .then((response) => setPlaylists(response.data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPlaylists();
    }, [fetchPlaylists])
  );

  const deletePlaylist = (id: string) => {
    Alert.alert(
      "Delete Playlist",
      "Are you sure you want to delete this playlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            axios
              .delete(`http://localhost:3000/playlists/${id}`)
              .then(() =>
                setPlaylists((prevPlaylists) =>
                  prevPlaylists.filter((playlist) => playlist._id !== id)
                )
              )
              .catch((error) => console.error(error));
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Playlist }) => (
    <Pressable
      style={styles.playlistCard}
      onPress={() =>
        navigation.navigate("SelectedSongScreen", { playlistId: item._id })
      }
    >
      <Text style={styles.playlistTitle}>{item.title}</Text>
      <Pressable onPress={() => deletePlaylist(item._id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </Pressable>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Playlists</Text>
      <Pressable
        style={styles.createButton}
        onPress={() => navigation.navigate("CreatePlaylist")}
      >
        <Text style={styles.createButtonText}>Create Playlist</Text>
      </Pressable>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={playlists}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  listContent: {
    flexGrow: 1,
    width: "100%",
  },
  playlistCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  playlistTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  deleteButton: {
    color: "red",
  },
});
