import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Dimensions,
  Alert,
  TextInput,
  View as DefaultView,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/types";
import { Stack } from "expo-router";
import * as FileSystem from "expo-file-system";
import apiClient from "@/services/authService";
import NetInfo from "@react-native-community/netinfo";

type ChordsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Chords"
>;

export default function Chords() {
  const buttonColor = useThemeColor({}, "buttonColorItems");
  const buttonPressedColor = useThemeColor({}, "buttonColorItemsPressed");

  const navigation = useNavigation<ChordsScreenNavigationProp>();
  const [songs, setSongs] = useState<
    Array<{
      id: number;
      title: string;
      artist: string;
      _id: string;
      pdfKey: string;
    }>
  >([]);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState(songs);

  useEffect(() => {
    const checkConnectivity = async () => {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        fetchSongs();
      } else {
        loadOfflineSongs();
        setIsOffline(true);
      }
    };

    checkConnectivity();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await apiClient.get("/songs/");
      setSongs(response.data);
      setFilteredSongs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadOfflineSongs = async () => {
    const dir = `${FileSystem.documentDirectory}songs`;
    try {
      const files = await FileSystem.readDirectoryAsync(dir);
      const songs = [];
      for (const file of files) {
        const fileUri = `${dir}/${file}`;
        const song = await FileSystem.readAsStringAsync(fileUri);
        songs.push(JSON.parse(song));
      }
      setSongs(songs);
      setFilteredSongs(songs);
      if (songs.length === 0) {
        Alert.alert("No downloaded songs available.");
      }
    } catch (error) {
      // console.error("Error reading offline songs", error);
      Alert.alert("No downloaded songs available.");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSongs(filtered);
  };

  const { width } = Dimensions.get("window");
  const responsiveFontSize = width / 24; // Adjust the divisor to get the desired size
  const responsivePadding = width / 40; // Adjust the divisor to get the desired padding

  const renderItem = ({
    item,
  }: {
    item: {
      id: number;
      title: string;
      artist: string;
      _id: string;
      pdfKey: string;
    };
  }) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: pressed ? buttonPressedColor : buttonColor,
          padding: responsivePadding,
        },
      ]}
      onPress={() => navigation.navigate("SongDetails", { song: item })}
    >
      <Text
        style={[styles.title, { fontSize: responsiveFontSize * 0.9 }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.title}
      </Text>
      <Text
        style={[styles.artist, { fontSize: responsiveFontSize * 0.75 }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.artist}
      </Text>
    </Pressable>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/guitar3.jpg")}
          style={styles.mainImage}
        />
        <Text
          style={[styles.titleMain, { fontSize: responsiveFontSize * 1.9 }]}
        >
          Songs
        </Text>
        {isOffline && <Text style={styles.offlineModeText}>Offline Mode</Text>}
        {isOffline && (
          <DefaultView style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Songs or Artists"
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#888"
            />
          </DefaultView>
        )}
        <FlatList
          data={filteredSongs}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContent}
          style={{ maxHeight: "75%" }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  titleMain: {
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: "20%",
    left: "5%",
    color: "white",
  },
  card: {
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
    height: 70, // Set a fixed height for consistency
    justifyContent: "center", // Center content vertically
  },
  title: {
    fontWeight: "bold",
  },
  artist: {
    color: "#888",
  },
  mainImage: {
    position: "absolute",
    width: "200%",
    height: "180%",
    top: 0,
    left: -30,
  },
  offlineModeText: {
    color: "red",
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 10,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: "white",
  },
});
