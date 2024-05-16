import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/types";
import { useThemeColor } from "@/components/Themed";


type ChordsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Chords"
>;

export default function Chords() {

  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");
 
  const navigation = useNavigation<ChordsScreenNavigationProp>();
  const [songs, setSongs] = useState<
    Array<{ id: number; title: string; artist: string }>
  >([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/songs/")
      .then((response) => {
        setSongs(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const renderItem = ({
    item,
  }: {
    item: { id: number; title: string; artist: string };
  }) => (
    <Pressable
      key={item.id}
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

  return (
    <View style={styles.container}>
      <FlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContent}
      />
    </View>
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
  card: {
    
    padding: 15,
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
  },
  cardPressed: {
    opacity: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 16,
    color: "#888",
  },
});
