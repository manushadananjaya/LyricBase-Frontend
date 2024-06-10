import React, { useEffect, useState } from "react";
import {

  StyleSheet,
  Button,
  ActivityIndicator,
  
  Pressable,
  Alert,
} from "react-native";
import { Text ,View} from "@/components/Themed";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as FileSystem from "expo-file-system";
import apiClient from "@/services/authService";


export default function OfflineDownloads() {
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [artistCount, setArtistCount] = useState(0);
  const [songsCount, setSongsCount] = useState(0);
  const [downloadedSongsCount, setDownloadedSongsCount] = useState(0);
  const backgroundColor = useThemeColor({}, "background");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artistResponse = await apiClient.get("/artists/");
        setArtistCount(artistResponse.data.length);

        const songResponse = await apiClient.get("/songs/songCount");
        setSongsCount(songResponse.data);

        checkDownloadedSongs();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const checkDownloadedSongs = async () => {
    const dir = `${FileSystem.documentDirectory}songs`;
    const files = await FileSystem.readDirectoryAsync(dir);
    setDownloadedSongsCount(files.length);
  };

  const fetchAndDownloadSongs = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/songs/download");
      await saveSongsToDevice(response.data);
      await logDownloadedSongs();
      checkDownloadedSongs();
    } catch (error) {
      console.error("Error downloading songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSongsToDevice = async (songs: string | any[]) => {
    const dir = `${FileSystem.documentDirectory}songs`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const totalSongs = songs.length;

    for (let i = 0; i < totalSongs; i++) {
      const song = songs[i];
      const fileUri = `${dir}/${song._id}.json`;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(song));
      // Simulating progress with a delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setDownloadProgress(((i + 1) / totalSongs) * 100);
    }
  };

  const logDownloadedSongs = async () => {
    const dir = `${FileSystem.documentDirectory}songs`;
    const files = await FileSystem.readDirectoryAsync(dir);

    const songs = [];
    for (const file of files) {
      const fileUri = `${dir}/${file}`;
      const song = await FileSystem.readAsStringAsync(fileUri);
      songs.push(JSON.parse(song));
    }
    console.log("Downloaded Songs:", songs);
  };

  const confirmDeleteSongs = () => {
    Alert.alert(
      "Delete Songs",
      "Are you sure you want to delete all downloaded songs?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: deleteDownloadedSongs,
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const deleteDownloadedSongs = async () => {
    const dir = `${FileSystem.documentDirectory}songs`;
    await FileSystem.deleteAsync(dir, { idempotent: true });
    setDownloadedSongsCount(0);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.title}>Want to use Offline? </Text>
      <Text style={styles.subtitle}>Download now!</Text>
      <Text style={styles.infoText}>
        We have {artistCount} artists and {songsCount} songs.
      </Text>

      <Button
        title="Download All Songs"
        onPress={fetchAndDownloadSongs}
        disabled={loading}
      />

      {loading && (
        <View style={styles.progressContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.progressText}>
            Downloading: {downloadProgress.toFixed(2)}%
          </Text>
        </View>
      )}

      {downloadedSongsCount > 0 && (
        <Pressable onPress={confirmDeleteSongs} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete Downloaded Songs</Text>
        </Pressable>
      )}

      <Text style={styles.downloadedSongsText}>
        Downloaded Songs: {downloadedSongsCount}
      </Text>
      <Text style={styles.infoTextLong}>
        Please note that this feature is only available in the full version of
        the app. This is just a demo. Please restart the app to see the
        downloaded songs in the songs tab.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
   
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    
  },
  infoTextLong: {
    fontSize: 16,
    marginTop: 20,
    color: "#666666",
    textAlign: "center",
  },
  progressContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  progressText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    
  },
  deleteButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ff4444",
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  downloadedSongsText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666666",
  },
});
