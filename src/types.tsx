export type MelodyPiece = {
  note: string;
  beat: string;
  beatNumber: number;
};

export type ChordInfo = {
  chordName: string;
  notes: Array<string>;
};

export interface ChordTypes {
  [key: string]: ChordInfo;
}

export interface NoteTypes {
  [key: string]: Array<string>;
}

export type SongInfo = {
  chordProgression: Array<string>;
  melody: Array<MelodyPiece>;
};

export type Measure = {
  bar: number;
  beat: number;
  totalBeat: number;
};

export type BeatInfo = {
  beatNumber: number;
  rhythm: string;
  lead: string;
  bassDrum: string;
  snareDrum: string;
};

export const NUMBER_OF_BEATS = 16;
