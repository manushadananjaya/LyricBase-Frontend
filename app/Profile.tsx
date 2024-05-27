import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Text, View } from "@/components/Themed";
import { useTheme } from "@/context/themeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLogout } from "@/hooks/useLogout";
import { useAuthContext } from "@/hooks/useAuthContext";

const { width } = Dimensions.get("window");

function ProfileScreen() {
  const { handleLogout } = useLogout();
  const { user, loading } = useAuthContext();
  const { theme, setTheme } = useTheme();

  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");

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
    // backgroundColor: "#f0f0f0",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  profileContainer: {
    width: width > 600 ? "60%" : "90%", // Adjust the width based on screen size
    maxWidth: 410,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 10,
    // backgroundColor: "#fff",
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
    // color: "#333",
  },
  greeting: {
    fontSize: 24,
    marginBottom: 5,
    // color: "#666",
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
    // color: "#444",
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
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    // backgroundColor: "#007AFF",
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
    // color: "#fff",
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
