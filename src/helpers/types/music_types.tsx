import {
  Scales,
  Progressions,
  ChordUrl,
  BeatToneLength,
  ToneToEighths,
} from "./types";

export const BEATS_PER_BAR = 4;
export const NUMBER_OF_BEATS = 16;
export const NUMBER_OF_BARS = NUMBER_OF_BEATS / BEATS_PER_BAR;

export const MAX_TEMPO = 160;
export const MIN_TEMPO = 100;

export const BEAT_LENGTHS = ["1", "0.5"];
export const BEAT_LENGTH_TO_TONE_LENGTH: BeatToneLength = {
  "4": "1n",
  "1": "4n",
  "0.5": "8n",
  "0.25": "8n",
};
export const TONE_LENGTHS_TO_EIGHTH_NOTES: ToneToEighths = {
  "1n": 8,
  "4n": 2,
  "8n": 1,
};

export const notes: Array<string> = [
  "Ab",
  "A",
  "Bb",
  "B",
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
];

export const scales: Scales = {
  Major: [0, 2, 2, 1, 2, 2, 2],
  Minor: [0, 2, 1, 2, 2, 1, 2],
};

export const progressions: Progressions = {
  Major: ["I", "ii", "iii", "IV", "V", "vi", "VII°"],
  Minor: ["i", "ii°", "III", "iv", "v", "VI", "VII"],
};

export const chordUrls: ChordUrl = {
  Am: "https://jambuddy.s3.amazonaws.com/a_minor.m4a",
  C: "https://jambuddy.s3.amazonaws.com/c_major.m4a",
  Dm: "https://jambuddy.s3.amazonaws.com/d_minor.m4a",
  Em: "https://jambuddy.s3.amazonaws.com/e_minor.m4a",
  F: "https://jambuddy.s3.amazonaws.com/f_major.m4a",
  G: "https://jambuddy.s3.amazonaws.com/g_major.m4a",
};
