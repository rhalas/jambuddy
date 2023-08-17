import {
  ChordInfo,
  SongInfo,
  NUMBER_OF_BARS,
  BEATS_PER_BAR,
  TrackData,
  ChordUrl,
  KeyInfo,
  Scales,
  Progressions,
} from "./types";
import { makeNewTrack } from "./utils";
import * as Tone from "tone";

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

const generatedRandomProgression = (
  chordDetails: Array<ChordInfo>
): Array<ChordInfo> => {
  const chordProgression: Array<ChordInfo> = [];
  for (let i = 0; i < NUMBER_OF_BARS; i++) {
    let randomChord =
      chordDetails[Math.floor(Math.random() * chordDetails.length)];
    if (chordProgression.length >= 1) {
      while (
        randomChord.position ===
        chordProgression[chordProgression.length - 1].position
      ) {
        randomChord =
          chordDetails[Math.floor(Math.random() * chordDetails.length)];
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

export const generateRhythmTrack = (
  chordProgression: Array<ChordInfo>,
  synth: Tone.PolySynth
): TrackData => {
  const newRhythmTrack = makeNewTrack("Pads", { polySynth: synth });
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

const generateMelodyTrack = (
  synth: Tone.PolySynth,
  scaleNotes: Array<string>
): TrackData => {
  const newMelodyTrack = makeNewTrack("Melody", { polySynth: synth });

  for (
    let beatNumber = 0;
    beatNumber < newMelodyTrack.beats.length;
    beatNumber++
  ) {
    if (Math.floor(Math.random() * 2) == 1) {
      const note = scaleNotes[Math.floor(Math.random() * scaleNotes.length)];
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

const generateSnareDrumTrack = (synth: Tone.NoiseSynth): TrackData => {
  const newSnareDrumTrack = makeNewTrack("Snare Drum", { noiseSynth: synth });
  for (let i = 0; i < newSnareDrumTrack.beats.length; i++) {
    if (i % 2 === 1) {
      newSnareDrumTrack.beats[i].label = "S";
      newSnareDrumTrack.beats[i].length = "8n";
    }
  }

  return newSnareDrumTrack;
};

const generateBassTrack = (
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

const generateGuitarRhythmTrack = async (
  progression: Array<ChordInfo>
): Promise<TrackData> => {
  const newGuitarRhythmTrack = makeNewTrack("Guitar", {});
  const chordsToFetch = progression.map((p) => p.chordName);
  newGuitarRhythmTrack.synth.samplePlayers = {};

  for (let i = 0; i < chordsToFetch.length; i++) {
    const newPlayer = new Tone.Player().toDestination();
    const listOfChords = Object.keys(chordUrls);
    if (listOfChords[i].includes(chordsToFetch[i])) {
      await newPlayer.load(chordUrls[chordsToFetch[i]]);
      newPlayer.volume.value = -7;

      const measureToPlay = i * BEATS_PER_BAR;
      newGuitarRhythmTrack.beats[measureToPlay].label = chordsToFetch[i];
      newGuitarRhythmTrack.beats[measureToPlay].length = "8n";
      newGuitarRhythmTrack.synth.samplePlayers[chordsToFetch[i]] = newPlayer;
    }
  }

  return newGuitarRhythmTrack;
};

const generateScaleNotes = (songKey: KeyInfo) => {
  const rootPosition = notes.indexOf(songKey.rootNote);
  const scaleFormula = scales[songKey.progression];

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
  } else if (currentPosition.charAt(0) === "i") {
    chordName = `${rootNote}m`;
  } else {
    chordName = `${rootNote}`;
  }

  return chordName;
};

const generateChordDetails = (
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

export const makeRandomProgression = async (
  songKey: KeyInfo,
  rhythmSynth: Tone.PolySynth,
  leadSynth: Tone.PolySynth,
  bassSynth: Tone.PolySynth,
  bassDrumSynth: Tone.MembraneSynth,
  snareDrumSynth: Tone.NoiseSynth
): Promise<SongInfo> => {
  const scale = generateScaleNotes(songKey);
  const chordDetails = generateChordDetails(scale, songKey.progression);

  const progression = generatedRandomProgression(chordDetails);
  const rhythmTrack = generateRhythmTrack(progression, rhythmSynth);
  const melodyTrack = generateMelodyTrack(leadSynth, scale);
  const bassDrumTrack = generateBassDrumTrack(bassDrumSynth);
  const snareDrumTrack = generateSnareDrumTrack(snareDrumSynth);
  const bassTrack = generateBassTrack(bassSynth, rhythmTrack);
  //const guitarRhythmTrack = await generateGuitarRhythmTrack(progression);

  return {
    rhythmTrack: rhythmTrack,
    melodyTrack: melodyTrack,
    bassDrumTrack: bassDrumTrack,
    bassTrack: bassTrack,
    snareDrumTrack: snareDrumTrack,
    guitarRhythmTrack: snareDrumTrack,
    progression: progression,
  };
};
