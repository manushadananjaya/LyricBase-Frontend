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
  Playlists: undefined;
  CreatePlaylist: undefined;
  EditPlaylist: { playlistId: string };
  SelectedSongs: { playlistId: string , isEditable: boolean };
  PlaylistDetails: {
    playlist: {
      [x: string]: any;
      id: string;
      title: string;
      userPlay: {
        _id: string;
        name: string;
      };
      songs: {
        id: number;
        title: string;
        artist: string;
        _id: string;
        pdfKey: string;
      }[];
    };
  };
  Welcome : undefined;
};
