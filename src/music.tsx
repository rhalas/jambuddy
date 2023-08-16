import {
  ChordInfo,
  NoteTypes,
  SongInfo,
  NUMBER_OF_BARS,
  BEATS_PER_BAR,
  TrackData,
} from "./types";
import { makeNewTrack } from "./utils";
import * as Tone from "tone";

export const chords: Array<ChordInfo> = [
  { position: "I", chordName: "C", notes: ["C3", "E3", "G4"] },
  { position: "ii", chordName: "Dm", notes: ["D3", "F3", "A4"] },
  { position: "iii", chordName: "Em", notes: ["E3", "G3", "B4"] },
  { position: "IV", chordName: "F", notes: ["F3", "A4", "C4"] },
  { position: "V", chordName: "G", notes: ["G3", "B4", "D4"] },
  { position: "vi", chordName: "Am", notes: ["A4", "C4", "E4"] },
];

export const scaleNotes: NoteTypes = {
  C: ["C", "D", "E", "F", "G", "A", "B", "C"],
};

export const generatedRandomProgression = (): Array<ChordInfo> => {
  const chordProgression: Array<ChordInfo> = [];
  for (let i = 0; i < NUMBER_OF_BARS; i++) {
    const randomChord = chords[Math.floor(Math.random() * chords.length)];
    chordProgression.push({
      position: randomChord.position,
      chordName: randomChord.chordName,
      notes: randomChord.notes,
    });
  }

  return chordProgression;
};

export const generateRhythmTrack = (
  chordProgression: Array<ChordInfo>,
  synth: Tone.PolySynth
): TrackData => {
  const newRhythmTrack = makeNewTrack("Rhythm", { polySynth: synth });
  let currChordPos = 0;
  for (
    let beatNumber = 0;
    beatNumber < newRhythmTrack.beats.length;
    beatNumber++
  ) {
    if (beatNumber % BEATS_PER_BAR == 0) {
      newRhythmTrack.beats[beatNumber] = {
        beatNumber: beatNumber,
        label: chordProgression[currChordPos].chordName,
        beatData: chordProgression[currChordPos].notes,
        length: "1n",
      };
      currChordPos += 1;
    } else {
      newRhythmTrack.beats[beatNumber] = {
        beatNumber: beatNumber,
        label: "",
        beatData: [],
        length: "",
      };
    }
  }

  return newRhythmTrack;
};

export const generateMelodyTrack = (
  songKey: string,
  synth: Tone.PolySynth
): TrackData => {
  const newMelodyTrack = makeNewTrack("Melody", { polySynth: synth });
  const notes = scaleNotes[songKey];

  for (
    let beatNumber = 0;
    beatNumber < newMelodyTrack.beats.length;
    beatNumber++
  ) {
    if (Math.floor(Math.random() * 2) == 1) {
      const note = notes[Math.floor(Math.random() * notes.length)];
      const octave = Math.floor(Math.random() * 3) + 2;
      const newNote = `${note}${octave}`;

      newMelodyTrack.beats[beatNumber].label = newNote;
      newMelodyTrack.beats[beatNumber].beatData = [newNote];
      newMelodyTrack.beats[beatNumber].length = "8n";
    }
  }

  return newMelodyTrack;
};

export const generateBassDrumTrack = (synth: Tone.MembraneSynth): TrackData => {
  const newBassDrumTrack = makeNewTrack("Bass Drum", { membraneSynth: synth });
  for (let i = 0; i < newBassDrumTrack.beats.length; i++) {
    if (i % 2 === 0) {
      newBassDrumTrack.beats[i].label = "B";
      newBassDrumTrack.beats[i].length = "8n";
      newBassDrumTrack.beats[i].beatData = ["C2"];
    }
  }

  return newBassDrumTrack;
};

export const generateSnareDrumTrack = (synth: Tone.NoiseSynth): TrackData => {
  const newSnareDrumTrack = makeNewTrack("Snare Drum", { noiseSynth: synth });
  for (let i = 0; i < newSnareDrumTrack.beats.length; i++) {
    if (i % 2 === 1) {
      newSnareDrumTrack.beats[i].label = "S";
      newSnareDrumTrack.beats[i].length = "8n";
    }
  }

  return newSnareDrumTrack;
};

export const generateBassTrack = (
  synth: Tone.PolySynth,
  rhythmTrack: TrackData
): TrackData => {
  const newBassTrack = makeNewTrack("Bass", { polySynth: synth });

  const chords = [];
  for (let i = 0; i < newBassTrack.beats.length; i++) {
    if (rhythmTrack.beats[i].beatData.length) {
      chords.push(rhythmTrack.beats[i].beatData);
    }
  }

  for (let i = 0; i < chords.length; i++) {
    const chordNotes = chords[i];

    newBassTrack.beats[i * BEATS_PER_BAR].beatData = [
      `${chords[i][0].charAt(0)}1`,
    ];
    newBassTrack.beats[i * BEATS_PER_BAR].label = `${chords[i][0].charAt(0)}1`;
    newBassTrack.beats[i * BEATS_PER_BAR].length = "8n";

    for (let measure = 1; measure < BEATS_PER_BAR; measure++) {
      if (Math.floor(Math.random() * 3) == 1) {
        const randomNote = `${chordNotes[
          Math.floor(Math.random() * chords[0].length)
        ].charAt(0)}1`;

        newBassTrack.beats[i * BEATS_PER_BAR + measure].beatData = [randomNote];
        newBassTrack.beats[i * BEATS_PER_BAR + measure].label = randomNote;
        newBassTrack.beats[i * BEATS_PER_BAR + measure].length = "8n";
      }
    }
  }

  return newBassTrack;
};

export const makeRandomProgression = (
  songKey: string,
  rhythmSynth: Tone.PolySynth,
  leadSynth: Tone.PolySynth,
  bassSynth: Tone.PolySynth,
  bassDrumSynth: Tone.MembraneSynth,
  snareDrumSynth: Tone.NoiseSynth
): SongInfo => {
  const progression = generatedRandomProgression();
  const rhythmTrack = generateRhythmTrack(progression, rhythmSynth);
  const melodyTrack = generateMelodyTrack(songKey, leadSynth);
  const bassDrumTrack = generateBassDrumTrack(bassDrumSynth);
  const snareDrumTrack = generateSnareDrumTrack(snareDrumSynth);
  const bassTrack = generateBassTrack(bassSynth, rhythmTrack);

  return {
    rhythmTrack: rhythmTrack,
    melodyTrack: melodyTrack,
    bassDrumTrack: bassDrumTrack,
    bassTrack: bassTrack,
    snareDrumTrack: snareDrumTrack,
  };
};
