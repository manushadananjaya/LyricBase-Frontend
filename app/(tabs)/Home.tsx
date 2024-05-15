import React from "react";
import { StyleSheet, View, Text } from "react-native";
import FeatureCard from "@/components/homeScreen/FeatureCard";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chords App</Text>
      <FeatureCard
        title="Feature 1"
        content="Description of feature 1."
        onPress={() => console.log("Feature 1 Pressed")}
      />
      <FeatureCard
        title="Feature 2"
        content="Description of feature 2."
        onPress={() => console.log("Feature 2 Pressed")}
      />
      <FeatureCard
        title="Feature 3"
        content="Description of feature 3."
        onPress={() => console.log("Feature 3 Pressed")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
