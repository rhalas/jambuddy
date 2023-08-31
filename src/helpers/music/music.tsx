import { ChordInfo, ProgressionDetails } from "../types/types";
import {
  NUMBER_OF_BARS,
  BEATS_PER_BAR,
  notes,
  scales,
  progressions,
  BEAT_LENGTHS,
  MAX_TEMPO,
  MIN_TEMPO,
} from "../types/music_types";
import { Dispatch, SetStateAction } from "react";
import * as Tone from "tone";

export const prepareTempo = (
  currentTempo: number,
  setTempo: Dispatch<SetStateAction<number>>
) => {
  let tempoToUse = currentTempo;
  if (tempoToUse === -1) {
    tempoToUse =
      Math.floor(Math.random() * (MAX_TEMPO - MIN_TEMPO + 1)) + MIN_TEMPO;
  }

  if (Tone.Transport.state === "stopped") {
    Tone.Transport.bpm.value = tempoToUse;
    Tone.Transport.start();
  }

  setTempo(tempoToUse);
};

export const generateNewProgression = (): ProgressionDetails => {
  const newProgressionDetail: ProgressionDetails = {
    rootNote: "",
    mode: "",
    progression: [],
    scale: [],
    tracks: [],
  };

  const rootNote = notes[Math.floor(Math.random() * notes.length)];
  const listOfModes = Object.keys(progressions);
  const newMode = listOfModes[Math.floor(Math.random() * listOfModes.length)];

  newProgressionDetail.rootNote = rootNote;
  newProgressionDetail.mode = newMode;

  const scale = generateScaleNotes(newProgressionDetail);
  const chordDetails = generateChordDetails(scale, newProgressionDetail.mode);
  const progression = generatedRandomProgression(chordDetails);

  newProgressionDetail.progression = progression;
  newProgressionDetail.scale = scale;

  return newProgressionDetail;
};

export const generatedRandomProgression = (
  chordDetails: Array<ChordInfo>
): Array<ChordInfo> => {
  const chordProgression: Array<ChordInfo> = [];
  const chords = chordDetails.filter((c) => !c.position.includes("°"));

  for (let i = 0; i < NUMBER_OF_BARS; i++) {
    let randomChord = chords[Math.floor(Math.random() * chords.length)];

    if (chordProgression.length >= 1) {
      while (
        randomChord.position ===
        chordProgression[chordProgression.length - 1].position
      ) {
        randomChord = chords[Math.floor(Math.random() * chords.length)];
      }
    }
    chordProgression.push({
      position: randomChord.position,
      chordName: randomChord.chordName,
      notes: randomChord.notes,
    });
  }
  return chordProgression;
};

export const getABeatLength = () => {
  return BEAT_LENGTHS[Math.floor(Math.random() * BEAT_LENGTHS.length)];
};

export const beatToTriggerTime = (currentBeat: number): string => {
  const measure = Math.floor(currentBeat / BEATS_PER_BAR);
  const beat = currentBeat % 4;
  return `+${measure}:${beat}`;
};
export const generateScaleNotes = (songKey: ProgressionDetails) => {
  const rootPosition = notes.indexOf(songKey.rootNote);
  const scaleFormula = scales[songKey.mode];

  const notesInScale: Array<string> = [];
  let totalDelta = rootPosition;
  scaleFormula.forEach((nextNotePosition) => {
    totalDelta += nextNotePosition;
    notesInScale.push(notes[totalDelta % notes.length]);
  });

  return notesInScale;
};

const getChordName = (currentPosition: string, rootNote: string) => {
  let chordName = "";
  if (currentPosition.charAt(currentPosition.length - 1) === "°") {
    chordName = `${rootNote}dim`;
  } else if (["i", "v"].includes(currentPosition.charAt(0))) {
    chordName = `${rootNote}m`;
  } else {
    chordName = `${rootNote}`;
  }

  return chordName;
};

export const generateChordDetails = (
  scaleNotes: Array<string>,
  progression: string
): Array<ChordInfo> => {
  const selectedProgression = progressions[progression];
  const chordProgression = [];
  const defaultNoteOctave = 3;

  for (let i = 0; i < selectedProgression.length; i++) {
    const chordNotes = [
      `${scaleNotes[i]}${
        defaultNoteOctave + Math.floor(i / scaleNotes.length)
      }`,
      `${scaleNotes[(i + 2) % scaleNotes.length]}${
        defaultNoteOctave + Math.floor((i + 2) / scaleNotes.length)
      }`,
      `${scaleNotes[(i + 4) % scaleNotes.length]}${
        defaultNoteOctave + Math.floor((i + 4) / scaleNotes.length)
      }`,
    ];

    const chordName = getChordName(selectedProgression[i], scaleNotes[i]);

    chordProgression.push({
      position: selectedProgression[i],
      chordName: chordName,
      notes: chordNotes,
    });
  }

  return chordProgression;
};
