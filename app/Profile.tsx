import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import { useLogout } from "@/hooks/useLogout";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function ProfileScreen() {
  const { handleLogout } = useLogout();
  const { user, loading } = useAuthContext();

  // console.log("User:", user);

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
      <Text style={styles.title}>Profile</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text style={styles.greeting}>Hello, {user.user.name}!</Text>
      <Text style={styles.mail}>{user.user.email}</Text>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#FF4500" : "#FF6347",
          },
          styles.button,
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    color: "#555",
  },
  mail: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#777",
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
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
