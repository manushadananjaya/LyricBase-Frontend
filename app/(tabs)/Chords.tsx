import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, Pressable ,Image} from "react-native";
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
    Array<{ id: number; title: string; artist: string ;_id:string ; pdfKey : string}>
  >([]);

  useEffect(() => {
    apiClient
      .get("/songs/")
      .then((response) => {
        setSongs(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const renderItem = ({
    item,
  }: {
    item: { id: number; title: string; artist: string ;_id:string ; pdfKey : string};
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
    <>
      <Stack.Screen options={{ headerShown: false }} />


      <View style={styles.container}>
        <Image source={require('../../assets/images/guitar3.jpg')} style={styles.mainImage}/>
        <Text style={styles.titleMain}>Songs</Text>
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
    fontSize: 30,
    fontFamily: "Montserrat-Bold",
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: "20%",
    left: "5%",
    color: "white",

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
  mainImage:{
    position: "absolute",
    width: "200%",
    height: "180%",
    top: 0,
    left: -30,
    opacity: 0.7,
  }
});
