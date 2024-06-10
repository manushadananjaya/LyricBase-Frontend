import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, Pressable, Image } from "react-native";
import { Text, View } from "@/components/Themed";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/types";
import { Stack } from "expo-router";
import NetInfo from "@react-native-community/netinfo";

import apiClient from "@/services/authService";

type ArtistsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Artists"
>;

interface Artist {
  id: number;
  name: string;
}

export default function Artists() {
  const buttonColor = useThemeColor({}, "buttonColorItems");
  const buttonPressedColor = useThemeColor({}, "buttonColorItemsPressed");
  const navigation = useNavigation<ArtistsScreenNavigationProp>();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isOffline) {
      apiClient
        .get("/artists/")
        .then((response) => {
          setArtists(response.data);
        })
        .catch((error) => console.error(error));
    }
  }, [isOffline]);

  const renderItem = ({ item }: { item: Artist }) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: pressed ? buttonPressedColor : buttonColor },
      ]}
      onPress={() => navigation.navigate("ArtistDetails", { artist: item })}
    >
      <Text style={styles.title}>{`${item}`}</Text>
    </Pressable>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/artists.jpg")}
          style={styles.mainImage}
        />
        <Text style={styles.titleMain}>Artists</Text>
        {isOffline && (
          
          <Text style={styles.offlineMessage}>You are in offline Mode</Text>
        )}
        <FlatList
          data={artists}
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
  titleMain: {
    fontSize: 30,
    fontFamily: "-Bold",
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: "20%",
    left: "5%",
    color: "white",
  },
  mainImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
  },
  offlineMessage: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
});
