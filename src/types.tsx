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

export type TrackSynth = {
  polySynth?: Tone.PolySynth;
  membraneSynth?: Tone.MembraneSynth;
  noiseSynth?: Tone.NoiseSynth;
};

export type TrackData = {
  beats: Array<Beat>;
  name: string;
  synth: TrackSynth;
};

export const BEATS_PER_BAR = 4;
export const NUMBER_OF_BEATS = 16;
export const NUMBER_OF_BARS = NUMBER_OF_BEATS / BEATS_PER_BAR;
