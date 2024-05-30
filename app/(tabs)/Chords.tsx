import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/types";
import { Stack } from "expo-router";
import apiClient from "@/services/authService";

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

  useEffect(() => {
    apiClient
      .get("/songs/")
      .then((response) => {
        setSongs(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const { width, height } = Dimensions.get("window");
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
        style={[styles.title, { fontSize: responsiveFontSize * 0.9}]}
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
        <FlatList
          data={songs}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContent}
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
    fontFamily: "Montserrat-Bold",
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
    opacity: 0.7,
  },
});
