import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Button } from "react-native";
import { Text, View } from "@/components/Themed";
import { useLogout } from "@/hooks/useLogout";
import {useAuthContext} from "@/hooks/useAuthContext";

export default function ProfileScreen() {
  const { handleLogout } = useLogout();

  const user = useAuthContext();
  if (!user) {
    return;
  }
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text> Helloo {user?.user?.user?.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
