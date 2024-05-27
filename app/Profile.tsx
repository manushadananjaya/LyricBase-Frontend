import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Text, View ,TextInput} from "@/components/Themed";
import { useTheme } from "@/context/themeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLogout } from "@/hooks/useLogout";
import { useAuthContext } from "@/hooks/useAuthContext";
import apiClient from "@/services/authService";

const { width } = Dimensions.get("window");

function ProfileScreen() {
  const { handleLogout } = useLogout();
  const { user, loading } = useAuthContext();
  const { theme, setTheme } = useTheme();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");

  const handleChangePassword = () => {
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    //check if the password is empty if empty send an error
    if (newPassword === "") {
      setError("Password cannot be empty");
      return;
    }

    //set password length to be greater than 8
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setNewPassword("");
      setConfirmNewPassword("");
      return;
    }


    apiClient
      .put("/auth/changePassword", {
        newPassword: newPassword,
      })
      .then(() => {
        alert("Password changed successfully");
        setNewPassword("");
        setConfirmNewPassword("");
        setError("");
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
 
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.errorText}>No user is logged in.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.greeting}>Hello, {user.user.name}!</Text>
          <Text style={styles.mail}>{user.user.email}</Text>
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />

          <View style={styles.settingsSection}>
            <Text style={styles.settingsTitle}>Settings</Text>
            <View style={styles.pickerRow}>
              <Text style={styles.settingsLabel}>Select Color Theme</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={theme}
                  style={styles.picker}
                  onValueChange={(itemValue) => setTheme(itemValue)}
                >
                  <Picker.Item label="Light" value="light" />
                  <Picker.Item label="Dark" value="dark" />
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.settingsTitle}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? buttonPressedColor : buttonColor,
                },
                styles.button,
              ]}
              onPress={handleChangePassword}
            >
              <Text style={styles.buttonText}>Change Password</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? buttonPressedColor : buttonColor,
              },
              styles.button,
            ]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  profileContainer: {
    width: width > 600 ? "60%" : "90%",
    maxWidth: 410,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    marginBottom: 5,
  },
  mail: {
    fontSize: 18,
    color: "#888",
    marginBottom: 30,
    textAlign: "center",
  },
  settingsSection: {
    width: "100%",
    marginBottom: 30,
    alignItems: "center",
  },
  settingsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  settingsLabel: {
    fontSize: 17,
    marginBottom: 10,
    color: "#555",
  },
  pickerContainer: {
    height: 50,
    width: "50%",
    backgroundColor: "#f9f9f9",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
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
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
    backgroundColor: "#ccc",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default ProfileScreen;
