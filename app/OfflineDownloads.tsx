import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  Text,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as FileSystem from "expo-file-system";
import apiClient from "@/services/authService";

export default function OfflineDownloads() {
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const backgroundColor = useThemeColor({}, "background");

  const fetchAndDownloadSongs = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/songs/download");
      await saveSongsToDevice(response.data);
      await logDownloadedSongs();
    } catch (error) {
      console.error(error);
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

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Button title="Download All Songs" onPress={fetchAndDownloadSongs} />
      {loading && (
        <>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.progressText}>
            Downloading: {downloadProgress.toFixed(2)}%
          </Text>
        </>
      )}
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
  progressText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
});
