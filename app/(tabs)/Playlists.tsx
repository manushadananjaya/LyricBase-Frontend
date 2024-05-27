import React, { useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
  Animated,
  PanResponder,
  Easing,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useThemeColor } from "@/hooks/useThemeColor";
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
  const listRef = useRef<FlatList>(null);

  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");
  const savedPlaylistsHeader = useThemeColor({}, "savedPlaylistsHeader");
  const savedPlaylistsContentColor = useThemeColor({}, "savedPlaylistsContentColor");
  const savedPlaylistsContainerBackground = useThemeColor({}, "savedPlaylistsContainerBackground");
  
 
  

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
        style={({ pressed }) => [
          styles.createButton,
          { backgroundColor: pressed ? buttonPressedColor : buttonColor },
        ]}
        onPress={() => navigation.navigate("CreatePlaylist")}
      >
        <Text style={styles.createButtonText}>Create Playlist</Text>
      </Pressable>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          ref={listRef}
          data={playlists}
          // initialNumToRender={5}
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
          style={{ maxHeight: 450 }}
        />
      )}
      <Animated.View
        style={[
          styles.savedPlaylistsContainer,
          {
            height: height,
            backgroundColor: savedPlaylistsContainerBackground,
          },
        ]}
      >
        <View {...panResponder.panHandlers}>
          <Pressable
            style={() => [
              styles.savedPlaylistsHeader,
              { backgroundColor: savedPlaylistsHeader },
            ]}
          >
            <Text style={styles.savedPlaylistsHeaderText}>Saved Playlists</Text>
          </Pressable>
        </View>
        <View
          style={
            (styles.savedPlaylistsContent,
            { backgroundColor: savedPlaylistsContentColor })
          }
        >
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
              style={{ maxHeight: "90%" }}
            />
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const PlaylistItem = ({ item, onDelete, onPress }) => {
  
  const playlistCardBackground = useThemeColor({}, "playlistCardBackground");
  const playlistCardBackgroundPressed = useThemeColor({}, "playlistCardBackgroundPressed");
  const deleteButtonColor = useThemeColor({}, "deleteButton");
  const deleteButtonPressedColor = useThemeColor({}, "deleteButtonPressed");
  

  return (
    <Pressable
      style={({ pressed }) => [
        styles.playlistCard,
        {
          backgroundColor: pressed
            ? playlistCardBackgroundPressed
            : playlistCardBackground,
        },
      ]}
      onPress={onPress}
    >
      <Text style={styles.playlistTitle}>{item.title}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.deleteButton,
          {
            backgroundColor: pressed
              ? deleteButtonPressedColor
              : deleteButtonColor,
          },
        ]}
        onPress={onDelete}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </Pressable>
    </Pressable>
  );
};

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
    paddingBottom: 150,
    marginBottom: 200,
    position: "relative",
  },
  playlistCard: {
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
    borderRadius: 10,
    padding: 5,
  },
  deleteButtonText: {
    fontWeight: "bold",
  },
  savedPlaylistsContainer: {
    flexGrow: 1,
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
