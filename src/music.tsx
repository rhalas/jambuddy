import { NoteTypes, MelodyPiece, SongInfo } from "./types";

export const chords: NoteTypes = {
  I: ["C3", "E3", "G4"],
  ii: ["D3", "F3", "A4"],
  iii: ["E3", "G3", "B4"],
  IV: ["F3", "A4", "C4"],
  V: ["G3", "B4", "D4"],
  vi: ["A4", "C4", "E4"],
  vii: ["C3"],
};

export const scaleNotes: NoteTypes = {
  C: ["C", "D", "E", "F", "G", "A", "B", "C"],
};

export const makeRandomProgression = (): SongInfo => {
  const chordKeys = Object.keys(chords);
  const progression: Array<string> = [];
  for (let i = 0; i < 4; i++) {
    progression.push(chordKeys[Math.floor(Math.random() * chordKeys.length)]);
  }

  const beatLocations: Array<string> = [];

  let totalBeats = 0;
  while (totalBeats < 15) {
    totalBeats += Math.floor(Math.random() * 3) + 1;
    if (totalBeats >= 16) {
      totalBeats = 15;
    }
    beatLocations.push(`+${Math.floor(totalBeats / 4)}:${totalBeats % 4}`);
  }

  const randomMelodyNotes: Array<string> = [];
  const notes = scaleNotes["C"];
  const melody: Array<MelodyPiece> = [];
  for (let i = 0; i < beatLocations.length; i++) {
    const note = notes[Math.floor(Math.random() * notes.length)];
    const octave = Math.floor(Math.random() * 3) + 2;
    randomMelodyNotes.push(`${note}${octave}`);
    melody.push({ note: `${note}${octave}`, beat: beatLocations[i] });
  }

  return { chordProgression: progression, melody: melody };
};
