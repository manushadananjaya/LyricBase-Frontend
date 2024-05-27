import React, { useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
  Animated,
  PanResponder,
  View,
  Easing,
} from "react-native";
import { Text } from "@/components/Themed";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@/components/types";
import apiClient from "@/services/authService";
import { useAuthContext } from "@/hooks/useAuthContext";

type PlaylistsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Playlists"
>;

interface Playlist {
  title: string;
  _id: string;
  name: string;
  songs: Song[];
}

export default function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [savedPlaylists, setSavedPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const navigation = useNavigation<PlaylistsScreenNavigationProp>();
  const { user } = useAuthContext();

  const fetchPlaylists = useCallback(() => {
    setLoading(true);
    apiClient
      .get<Playlist[]>("/playlists/")
      .then((response) => setPlaylists(response.data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const fetchSavedPlaylists = useCallback(() => {
    setLoadingSaved(true);
    apiClient
      .get<Playlist[]>("/playlists/saved")
      .then((response) => setSavedPlaylists(response.data))
      .catch((error) => console.error(error))
      .finally(() => setLoadingSaved(false));
  }, [user?._id]);

  useFocusEffect(
    useCallback(() => {
      fetchPlaylists();
      fetchSavedPlaylists();
    }, [fetchPlaylists, fetchSavedPlaylists])
  );

  const deletePlaylist = (id: string, isSaved: boolean) => {
    Alert.alert(
      "Delete Playlist",
      "Are you sure you want to delete this playlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const deleteRequest = isSaved
              ? apiClient.delete(`/playlists/saved/${id}`)
              : apiClient.delete(`/playlists/${id}`);

            deleteRequest
              .then(() => {
                if (isSaved) {
                  setSavedPlaylists((prevSavedPlaylists) =>
                    prevSavedPlaylists.filter((playlist) => playlist._id !== id)
                  );
                } else {
                  setPlaylists((prevPlaylists) =>
                    prevPlaylists.filter((playlist) => playlist._id !== id)
                  );
                }
              })
              .catch((error) => console.error(error));
          },
        },
      ]
    );
  };

  const initialHeight = 80;
  const expandedHeight = 600;
  const collapsedHeight = 80;

  const height = useRef(new Animated.Value(initialHeight)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (e, gestureState) => {
        const newHeight = height._value - gestureState.dy;
        if (newHeight < collapsedHeight) {
          height.setValue(collapsedHeight);
        } else if (newHeight > expandedHeight) {
          height.setValue(expandedHeight);
        } else {
          height.setValue(newHeight);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        const shouldExpand = gestureState.dy < -30;
        const shouldCollapse = gestureState.dy > 30;

        if (shouldExpand) {
          Animated.timing(height, {
            toValue: expandedHeight,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }).start();
        } else if (shouldCollapse) {
          Animated.timing(height, {
            toValue: collapsedHeight,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }).start();
        } else {
          Animated.spring(height, {
            toValue: height._value,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

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
          renderItem={({ item }) => (
            <PlaylistItem
              item={item}
              onDelete={() => deletePlaylist(item._id, false)}
              onPress={() =>
                navigation.navigate("SelectedSongScreen", {
                  playlistId: item._id,
                  isEditable: true,
                })
              }
            />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
        />
      )}
      <Animated.View
        style={[
          styles.savedPlaylistsContainer,
          {
            height: height,
          },
        ]}
      >
        <View {...panResponder.panHandlers}>
          <Pressable style={styles.savedPlaylistsHeader}>
            <Text style={styles.savedPlaylistsHeaderText}>Saved Playlists</Text>
          </Pressable>
        </View>
        <View style={styles.savedPlaylistsContent}>
          {loadingSaved ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : savedPlaylists.length === 0 ? (
            <View style={styles.noSavedPlaylists}>
              <Text>No saved playlists</Text>
            </View>
          ) : (
            <FlatList
              data={savedPlaylists}
              renderItem={({ item }) => (
                <PlaylistItem
                  item={item}
                  onDelete={() => deletePlaylist(item._id, true)}
                  onPress={() =>
                    navigation.navigate("SelectedSongScreen", {
                      playlistId: item._id,
                      isEditable: false,
                    })
                  }
                />
              )}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.listContentSongs}
            />
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const PlaylistItem = ({ item, onDelete, onPress }) => (
  <Pressable style={styles.playlistCard} onPress={onPress}>
    <Text style={styles.playlistTitle}>{item.title}</Text>
    <Pressable onPress={onDelete}>
      <Text style={styles.deleteButton}>Delete</Text>
    </Pressable>
  </Pressable>
);

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
    fontWeight: "bold",
    borderRadius: 10,
    padding: 5,
    backgroundColor: "#f0f0f0",
  },
  savedPlaylistsContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  savedPlaylistsHeader: {
    alignItems: "center",
    paddingVertical: 20,
  },
  savedPlaylistsHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  savedPlaylistsContent: {
    flex: 1,
  },
  listContentSongs: {
    paddingBottom: 20,
  },
  noSavedPlaylists: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export { Playlists };
