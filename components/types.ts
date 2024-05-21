export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  SongDetails: {
    song: {
      id: number;
      title: string;
      artist: string;
      _id: string;
      pdfKey: string;
    };
  };
  Chords: undefined;
  Search: undefined;
  Guitar: undefined;
  Artists: undefined;
  ArtistDetails: { artist: { id: number; name: string } };
  Playlists: undefined; // Screen for displaying user playlists
  CreatePlaylist: undefined; // Screen for creating a new playlist
  EditPlaylist: { playlistId: string }; // Screen for editing an existing playlist
  SelectedSongs: { playlistId: string }; // Screen for displaying selected songs of a playlist
};
