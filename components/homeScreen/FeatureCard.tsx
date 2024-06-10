import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { View ,Text } from "@/components/Themed";

import { useThemeColor } from "@/hooks/useThemeColor"

interface FeatureCardProps {
  title: string;
  content: string;
  onPress: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  content,
  onPress,
}) => {
  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");
  const FeatureCardBackground = useThemeColor({}, "featureCardBackground");
  const FeatureCardContent = useThemeColor({}, "featureCardContent");
  const FeatureCardTitle = useThemeColor({}, "featureCardTitle");

  return (
    <View style={[styles.card, { backgroundColor: FeatureCardBackground }]}>
      <Text style={[styles.cardTitle, { color: FeatureCardTitle }]}>
        {title}
      </Text>
      <Text style={[styles.cardContent, { color: FeatureCardContent }]}>
        {content}
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? buttonPressedColor : buttonColor },
        ]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>Explore</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    // backgroundColor: "rgba(233, 234, 236, 0.5)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    // color: "#000",
  },
  cardContent: {
    fontSize: 14,
    marginBottom: 10,
    color: "#888",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default FeatureCard;
