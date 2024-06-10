import React, { useState } from "react";
import { TextInput, Button, StyleSheet, Pressable,Image } from "react-native";
import { View, Text } from "@/components/Themed";

import { useThemeColor } from "@/hooks/useThemeColor";
import apiClient from "@/services/authService";

export default function RequestLyricsChords() {
  const [songName, setSongName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");

  const TextInputColor = useThemeColor({}, "TextInputColor");
  const buttonColor = useThemeColor({}, "button");
    const buttonPressedColor = useThemeColor({}, "buttonPressed");

  const handleRequestSubmit = () => {
    if (songName.trim() === "" || description.trim() === "" || email.trim() === "") {
      alert("Please fill out all fields.");
      return;
    }

    apiClient
      .post("users/requestSong", {
        songName,
        description,
        email,
      })
      .then(() => {
        alert("Request submitted successfully!");
        setSongName("");
        setDescription("");
        setEmail("");
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred. Please try again later.");
      });
    
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/icon.png")}
        style={styles.mainImage}
      />
      <Text style={styles.title}>
        Didn't find the song you were looking for? Request it here!
      </Text>

      <Text style={styles.subtitle}>
        Fill out the form below and we'll get back to you soon.
      </Text>

      <TextInput
        style={[styles.input, { color: TextInputColor }]}
        placeholder="Enter Email Address"
        keyboardType="email-address"
        value={email}
        placeholderTextColor={"#888"}
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={[styles.input, { color: TextInputColor }]}
        placeholder="Enter Song Name"
        value={songName}
        onChangeText={(text) => setSongName(text)}
        placeholderTextColor={"#888"}
      />

      <TextInput
        style={[
          styles.input,
          styles.descriptionInput,
          { color: TextInputColor },
        ]}
        placeholder="Add Some Description"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={(text) => setDescription(text)}
        placeholderTextColor={"#888"}
      />

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          {
            backgroundColor: pressed ? buttonPressedColor : buttonColor,
          },
        ]}
        onPress={handleRequestSubmit}
        disabled={
          songName.trim() === "" ||
          description.trim() === "" ||
          email.trim() === ""
        }
      >
        <Text style={styles.submitButtonText}>Submit Request</Text>
      </Pressable>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    marginTop: 10,
    color: "#666",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  descriptionInput: {
    height: 100,
  },
    submitButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        backgroundColor: "#007bff",
        marginTop: 20,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    mainImage: {
        height: 200,
        width: 200,
        borderRadius: 100,
        marginBottom: 20,
    },
    
});
