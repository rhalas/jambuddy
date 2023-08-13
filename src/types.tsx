export type MelodyPiece = {
  note: string;
  beat: string;
};

export interface NoteTypes {
  [key: string]: Array<string>;
}

export type SongInfo = {
  chordProgression: Array<string>;
  melody: Array<MelodyPiece>;
};
