import * as Tone from "tone";

export type ChordInfo = {
  position: string;
  chordName: string;
  notes: Array<string>;
};

export type SongInfo = {
  rhythmTrack: TrackData;
  melodyTrack: TrackData;
  bassDrumTrack: TrackData;
  bassTrack: TrackData;
  snareDrumTrack: TrackData;
  guitarRhythmTrack: TrackData;
  closedHiHatTrack: TrackData;
  openHiHatTrack: TrackData;
  vocalTrack: TrackData;
};

export type Beat = {
  beatNumber: number;
  label: string;
  beatData: Array<string>;
  length: string;
  triggerTime: string;
  beatLength: number;
};

export interface SamplePlayers {
  [key: string]: Tone.Player;
}

export type TrackSynth = {
  polySynth?: Tone.PolySynth;
  membraneSynth?: Tone.MembraneSynth;
  noiseSynth?: Tone.NoiseSynth;
  samplePlayers?: SamplePlayers;
  meter: Tone.Meter;
  fft: Tone.FFT;
};

export type TrackData = {
  beats: Array<Beat>;
  name: string;
  synth: TrackSynth;
  totalBeats: number;
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

export interface BeatToneLength {
  [key: string]: string;
}

export interface ToneToEighths {
  [key: string]: number;
}

export interface BeatLengthToDuration {
  [key: number]: string;
}

export type ProgressionDetails = {
  rootNote: string;
  mode: string;
  progression: ChordInfo[];
  scale: Array<string>;
  tracks: Array<TrackData>;
};

export type SongSynths = {
  rhythm: TrackSynth;
  lead: TrackSynth;
  vocal: TrackSynth;
  snareDrum: TrackSynth;
  bassDrum: TrackSynth;
  bass: TrackSynth;
  closedHiHat: TrackSynth;
  openHiHat: TrackSynth;
};
