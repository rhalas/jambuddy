import { ChordTypes, NoteTypes, MelodyPiece, SongInfo } from "./types";

export const chords: ChordTypes = {
  I: { chordName: "C", notes: ["C3", "E3", "G4"] },
  ii: { chordName: "Dm", notes: ["D3", "F3", "A4"] },
  iii: { chordName: "Em", notes: ["E3", "G3", "B4"] },
  IV: { chordName: "F", notes: ["F3", "A4", "C4"] },
  V: { chordName: "G", notes: ["G3", "B4", "D4"] },
  vi: { chordName: "Am", notes: ["A4", "C4", "E4"] },
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

  const melodyBeats: Array<number> = [];
  let totalBeats = 0;
  while (totalBeats < 15) {
    totalBeats += Math.floor(Math.random() * 3) + 1;
    if (totalBeats >= 16) {
      totalBeats = 15;
    }
    melodyBeats.push(totalBeats);
  }

  const randomMelodyNotes: Array<string> = [];
  const notes = scaleNotes["C"];
  const melody: Array<MelodyPiece> = [];
  for (let i = 0; i < melodyBeats.length; i++) {
    const note = notes[Math.floor(Math.random() * notes.length)];
    const octave = Math.floor(Math.random() * 3) + 2;
    randomMelodyNotes.push(`${note}${octave}`);
    melody.push({
      note: `${note}${octave}`,
      beat: `+${Math.floor(melodyBeats[i] / 4)}:${melodyBeats[i] % 4}`,
      beatNumber: melodyBeats[i],
    });
  }

  return { chordProgression: progression, melody: melody };
};
