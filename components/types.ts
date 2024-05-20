export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  SongDetails: {
    song: { id: number; title: string; artist: string; _id: string; pdfKey: string};
  };
  Chords: undefined;
  Search: undefined;
  Guitar: undefined;
  Artists: undefined;
  ArtistDetails: { artist: { id: number; name: string } };
};
