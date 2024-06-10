import React from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import Colors from "@/constants/Colors";
// import { useColorScheme } from "@/components/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return (
    <FontAwesome size={width * 0.07} style={{ marginBottom: -3 }} {...props} />
  );
}

export default function TabLayout() {
  const tabBarActiveTintColor = useThemeColor({}, "tint");
  const tabBarInactiveTintColor = useThemeColor({}, "tabIconDefault");
  const textColor = useThemeColor({}, "text");
  const tabBarBackground = useThemeColor({}, "tabBarBackground");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabBarActiveTintColor,
        tabBarInactiveTintColor: tabBarInactiveTintColor,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView intensity={50} style={StyleSheet.absoluteFill} />
          ) : (
            <View
              style={[StyleSheet.absoluteFill, { backgroundColor: tabBarBackground }]}
            />
          ),
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/Profile" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={width * 0.06}
                    color={textColor}
                    style={{
                      marginRight: width * 0.04,
                      opacity: pressed ? 0.5 : 1,
                    }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="Chords"
        options={{
          title: "Songs",
          tabBarIcon: ({ color }) => <TabBarIcon name="music" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Artists"
        options={{
          title: "Artists",
          tabBarIcon: ({ color }) => <TabBarIcon name="music" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Playlists"
        options={{
          title: "Playlists",
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: height * 0.098,
    borderTopWidth: 0,
    paddingVertical: 0,
    position: "absolute",
    
  },
  
  tabBarLabel: {
    fontSize: width * 0.03,
    fontWeight: "600",
    marginBottom: height * 0.001,
  },
  tabBarIcon: {
    marginTop: height * 0.01,
  },
});
