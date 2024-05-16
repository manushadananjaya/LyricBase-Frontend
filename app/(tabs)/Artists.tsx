import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/types";

type ArtistsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Artists"
>;

interface Artist {
  id: number;
  name: string;

}

export default function Artists() {
  const navigation = useNavigation<ArtistsScreenNavigationProp>();
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/artists/")
      .then((response) => {
        setArtists(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  
  const renderItem = ({ item }: { item: Artist }) => (
      

    (
      <Pressable
        key={item.id}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => navigation.navigate("ArtistDetails", { artist: item })}
      >
        <Text style={styles.title}>{`${item}`}</Text>
      </Pressable>
    )
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={artists}
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
    backgroundColor: "#fff",
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
});
