import React, { useState } from "react";
import { StyleSheet, Pressable, ScrollView } from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import { useThemeColor } from "@/components/Themed";



export default function Search() {

  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");  
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"name" | "artist">("name");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Songs</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search songs by name or artist"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.filterContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.filterButton,
            { backgroundColor: pressed ? buttonPressedColor : buttonColor },
            filter === "name" && styles.activeFilter,
          ]}
          onPress={() => setFilter("name")}
        >
          <Text style={styles.filterText}>By Name</Text>
        </Pressable>
        <Pressable 
            style={({ pressed }) => [
                styles.filterButton,
                { backgroundColor: pressed ? buttonPressedColor : buttonColor },
                filter === "artist" && styles.activeFilter,
            ]}
            onPress={() => setFilter("artist")}
        >
            <Text style={styles.filterText}>By Artist</Text>
        </Pressable>
      </View>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <ScrollView style={styles.resultsContainer}>
        {/* The results from the backend will be displayed here */}
        <Text>No results to display</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchBar: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
  },
  activeFilter: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  filterText: {
    fontSize: 16,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  resultsContainer: {
    width: "100%",
  },
});
