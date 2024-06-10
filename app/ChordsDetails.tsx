import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  View,
  Switch,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Text } from "@/components/Themed";
import { useThemeColor } from "@/hooks/useThemeColor";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/components/types";
import apiClient from "@/services/authService";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Slider from "@react-native-community/slider";

type ChordsDetailsRouteProp = RouteProp<RootStackParamList, "ChordsDetails">;

type ChordsDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChordsDetails"
>;
export default function ChordsDetails() {
  const route = useRoute<ChordsDetailsRouteProp>();
  const navigation = useNavigation<ChordsDetailsNavigationProp>();
  const { songId } = route.params;
  const [chords, setChords] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(16); // default font size
  const [autoScroll, setAutoScroll] = useState<boolean>(false); // auto-scroll switch state
  const [scrollSpeed, setScrollSpeed] = useState<number>(0.1); // default scroll speed
  const [panelVisible, setPanelVisible] = useState<boolean>(false); // state to control panel visibility
  const slideAnim = useRef(new Animated.Value(-200)).current; // initial value for slide animation
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);
  const contentHeight = useRef<number>(0);
  const scrollPosition = useRef<number>(0); // Current scroll position

  const buttonColor = useThemeColor({}, "button");
  const buttonPressedColor = useThemeColor({}, "buttonPressed");
  const SliderMinimumTrackTintColor = useThemeColor(
    {},
    "SliderMinimumTrackTintColor"
  );
  const SliderMaximumTrackTintColor = useThemeColor(
    {},
    "SliderMaximumTrackTintColor"
  );

  const swipeDownPanelBackground = useThemeColor(
    {},
    "swipeDownPanelBackground"
  );

  const { width } = Dimensions.get("window");
  const responsiveFontSize = width / 24; // Adjust the divisor to get the desired size
  const responsiveButtonPadding = width / 40; // Adjust the divisor to get the desired padding

  useEffect(() => {
    const fetchChords = async () => {
      try {
        const response = await apiClient.get(`/songs/song/${songId}/chords`);
        setChords(response.data);
      } catch (error) {
        console.error("Error fetching chords", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChords();
  }, [songId]);

  useEffect(() => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }

    if (autoScroll && scrollSpeed > 0) {
      // Scroll to the top when auto-scroll is enabled
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      scrollPosition.current = 0;

      // Start auto-scrolling
      scrollInterval.current = setInterval(() => {
        scrollPosition.current += scrollSpeed;
        scrollViewRef.current?.scrollTo({
          y: scrollPosition.current,
          animated: true,
        });
      }, 100);
    }

    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [autoScroll, scrollSpeed]);

  const handleContentSizeChange = (
    contentWidth: number,
    newContentHeight: number
  ) => {
    contentHeight.current = newContentHeight;
  };

  const togglePanel = () => {
    setPanelVisible(!panelVisible);
    Animated.timing(slideAnim, {
      toValue: panelVisible ? -500 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={togglePanel} style={styles.controlText}>
        <Text style={{ color: buttonPressedColor }}>
          {panelVisible ? "Hide" : "Show"} Controls
        </Text>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.panel,
          {
            transform: [{ translateY: slideAnim }],
            backgroundColor: swipeDownPanelBackground,
          },
        ]}
      >
        <View style={styles.sliderContainer}>
          <Text>Font Size</Text>
          <Slider
            style={styles.slider}
            minimumValue={10}
            maximumValue={30}
            value={fontSize}
            onValueChange={(value) => setFontSize(value)}
            step={1}
            minimumTrackTintColor={SliderMinimumTrackTintColor}
            maximumTrackTintColor={SliderMaximumTrackTintColor}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text>Auto Scroll</Text>
          <Switch
            value={autoScroll}
            onValueChange={(value) => setAutoScroll(value)}
            trackColor={{ true: buttonColor, false: "#767577" }}
            thumbColor={autoScroll ? buttonPressedColor : "#f4f3f4"}
          />
        </View>
        {autoScroll && (
          <View style={styles.sliderContainer}>
            <Text>Scroll Speed</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              value={scrollSpeed}
              onValueChange={(value) => setScrollSpeed(value)}
              step={0.01}
              minimumTrackTintColor={SliderMinimumTrackTintColor}
              maximumTrackTintColor={SliderMaximumTrackTintColor}
            />
          </View>
        )}
        <TouchableOpacity onPress={togglePanel} style={styles.barContainer}>
          <View style={styles.bar} />
        </TouchableOpacity>
      </Animated.View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : chords ? (
        <ScrollView
          style={styles.chordsContainer}
          ref={scrollViewRef}
          onContentSizeChange={handleContentSizeChange}
        >
          <Text style={[styles.chords, { fontSize }]}>{chords}</Text>
        </ScrollView>
      ) : (
        <Text>No Chords available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  barContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  bar: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#ccc",
  },
  panel: {
    position: "absolute",
    top: 0,
    width: "100%",

    paddingTop: 20,
    zIndex: 1,
    alignSelf: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    

  },
  sliderContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  switchContainer: {
    marginVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignSelf: "center",
  },
  slider: {
    width: "80%",
    height: 40,
  },
  chordsContainer: {
    flex: 1,
    marginTop: 10,
  },
  chords: {
    lineHeight: 24,
    fontFamily: "SpaceMono",
  },
  controlText: {
    alignItems: "center",
    padding: 10,
  },
});
