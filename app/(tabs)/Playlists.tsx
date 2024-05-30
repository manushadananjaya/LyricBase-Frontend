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
  Image,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@/components/types";
import apiClient from "@/services/authService";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Stack } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";

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
  const savedPlaylistsContentColor = useThemeColor(
    {},
    "savedPlaylistsContentColor"
  );
  const savedPlaylistsContainerBackground = useThemeColor(
    {},
    "savedPlaylistsContainerBackground"
  );

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
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/playlist2.jpeg")}
          style={styles.backgroundImage}
        />
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
            style={{ maxHeight: 490 }}
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
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: savedPlaylistsContainerBackground,
              opacity: height.interpolate({
                inputRange: [collapsedHeight, expandedHeight],
                outputRange: [0.5, 1],
                extrapolate: "clamp",
              }),
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          />
          <View {...panResponder.panHandlers}>
            <View
              style={[
                styles.swipeIndicatorContainer,
                { backgroundColor: savedPlaylistsContentColor },
              ]}
            >
              <View style={styles.swipeIndicator} />
            </View>
            <Pressable
              style={() => [
                styles.savedPlaylistsHeader,
                { backgroundColor: savedPlaylistsHeader },
              ]}
            >
              <Text style={styles.savedPlaylistsHeaderText}>
                Saved Playlists
              </Text>
            </Pressable>
          </View>
          <View
            style={[
              styles.savedPlaylistsContent,
              { backgroundColor: savedPlaylistsContentColor },
            ]}
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
    </>
  );
}

const PlaylistItem = ({ item, onDelete, onPress }) => {
  const playlistCardBackground = useThemeColor({}, "playlistCardBackground");
  const playlistCardBackgroundPressed = useThemeColor(
    {},
    "playlistCardBackgroundPressed"
  );
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
      <Text style={styles.playlistTitle} numberOfLines={1} ellipsizeMode="tail">
        {item.title}
      </Text>
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
        <Icon name="trash-bin" size={20} color="#fff" />
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
  backgroundImage: {
    position: "absolute",
    width: "200%",
    height: "200%",
    opacity: 0.2,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 50,
    fontFamily: "Montserrat-Regular",
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
    fontSize: 15,
    fontWeight: "bold",
    flexShrink: 1, // Allow the text to shrink
    marginRight: 10, // Add some margin to the right to separate it from the delete button
  },
  deleteButton: {
    borderRadius: 10,
    padding: 5,
  
  },
  savedPlaylistsContainer: {
    flexGrow: 1,
    width: "100%",
    position: "absolute",
    bottom: 0,
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
  swipeIndicatorContainer: {
    alignItems: "center",
    paddingVertical: 15,
  },
  swipeIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
  },
  savedPlaylistsHeader: {
    alignItems: "center",
    paddingBottom: 10,
  },
  savedPlaylistsHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  savedPlaylistsContent: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  listContentSongs: {
    paddingBottom: 150,
  },
  noSavedPlaylists: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
