
import { Button } from "react-native";

// Colors.ts
const tintColorLight = "#667085";
const tintColorDark = "#D0D5DD";

export default {
  light: {
    textMain: "#FCFCFD",
    text: "#344054", // Primary text color
    background: "#FCFCFD", // White background
    tint: tintColorLight, // Accent color
    tabIconDefault: "#D0D5DD", // Default icon color

    buttonColorItems: "#E4E7EC", // Button color
    buttonColorItemsPressed: "#C8CCE5", // Button pressed color

    button: "#475467", // Button color
    buttonPressed: "#3E4784", // Button pressed color

    playlistCardBackground: "#E4E7EC", // Playlist card background
    playlistCardBackgroundPressed: "#9EA5D1", // Playlist card background pressed

    deleteButton: "#686D76", // Delete button color
    deleteButtonPressed: "#FECDD6", // Delete button pressed color
    deleteButtonText: "#E4E7EC", // Delete button text color

    savedPlaylistsHeader: "#F8F9FC", // Saved playlists header
    savedPlaylistsContentColor: "#F8F9FC", // Saved playlists content color
    savedPlaylistsContainerBackground: "#F8F9FC", // Saved playlists container background
    editPlaylistSelectedSongCard: "#EAECF5", // Edit playlist selected song card
    placeholder: "#888888", // Placeholder color

    profileButton: "#F8F9FC", // Profile button color
    profileIcon: "#344054",

    featureCardBackground: "rgba(255, 255, 255, 0.5)",
    featureCardContent: "#373A40",
  },
  dark: {
    textMain: "#FCFCFD",
    text: "#FFFFFF", // White text for readability
    background: "#000000", // Black background
    tint: tintColorDark, // Accent color
    tabIconDefault: "#667085", // Default icon color

    buttonColorItems: "#2E3944", // Button color
    buttonColorItemsPressed: "#124E66", // Button pressed color

    button: "#212A31", // Button color (lighter shade of dark purple)
    buttonPressed: "#748D92", // Button pressed color
    playlistCardBackground: "#2E3944", // Dark background for playlist card
    playlistCardBackgroundPressed: "#748D92", // Playlist card background pressed
    deleteButton: "#D3D9D4", // Delete button color
    deleteButtonText: "#212A31", // Delete button text color
    deleteButtonPressed: "#FF0000", // Delete button pressed color

    savedPlaylistsHeader: "#495057", // Saved playlists header
    savedPlaylistsContentColor: "#495057", // Saved playlists content color
    savedPlaylistsContainerBackground: "#495057", // Saved playlists container background
    editPlaylistSelectedSongCard: "#212A31", // Edit playlist selected song card
    placeholder: "#AAAAAA", // Placeholder color

    profileButton: "#000000", // Profile button color
    profileIcon: "#FFFFFF",

    featureCardBackground: "rgba(0, 0, 0, 0.5)",
    featureCardContent: "#888",
  },
};
