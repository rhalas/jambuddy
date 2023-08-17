import * as Tone from "tone";

export type MelodyPiece = {
  note: string;
  beat: string;
  beatNumber: number;
};

export type ChordInfo = {
  position: string;
  chordName: string;
  notes: Array<string>;
};

export interface NoteTypes {
  [key: string]: Array<string>;
}

export type SongInfo = {
  rhythmTrack: TrackData;
  melodyTrack: TrackData;
  bassDrumTrack: TrackData;
  bassTrack: TrackData;
  snareDrumTrack: TrackData;
  guitarRhythmTrack: TrackData;
  progression: Array<ChordInfo>;
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
  bass: string;
};

export type Beat = {
  beatNumber: number;
  label: string;
  beatData: Array<string>;
  length: string;
};

export interface SamplePlayers {
  [key: string]: Tone.Player;
}

export type TrackSynth = {
  polySynth?: Tone.PolySynth;
  membraneSynth?: Tone.MembraneSynth;
  noiseSynth?: Tone.NoiseSynth;
  samplePlayers?: SamplePlayers;
};

export type TrackData = {
  beats: Array<Beat>;
  name: string;
  synth: TrackSynth;
};

export interface ChordUrl {
  [key: string]: string;
}

export interface Scales {
  [key: string]: Array<number>;
}

export interface Progressions {
  [key: string]: Array<string>;
}

export interface ChordFormula {
  [key: string]: Array<number>;
}

export type KeyInfo = {
  rootNote: string;
  progression: string;
};

export type SongSynths = {
  rhythm: Tone.PolySynth;
  lead: Tone.PolySynth;
  snareDrum: Tone.NoiseSynth;
  bassDrum: Tone.MembraneSynth;
  bass: Tone.PolySynth;
};

export const BEATS_PER_BAR = 4;
export const NUMBER_OF_BEATS = 16;
export const NUMBER_OF_BARS = NUMBER_OF_BEATS / BEATS_PER_BAR;
