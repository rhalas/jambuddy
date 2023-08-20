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
  SongSynths,
  NUMBER_OF_BEATS,
  TrackSynth,
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
  synth: TrackSynth
): TrackData => {
  const newRhythmTrack = makeNewTrack("Pads", synth);
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
        triggerTime: `+${Math.floor(beatNumber / BEATS_PER_BAR)}:0`,
      };
      currChordPos += 1;
    } else {
      newRhythmTrack.beats[beatNumber] = {
        beatNumber: beatNumber,
        label: "",
        beatData: [],
        length: "",
        triggerTime: "",
      };
    }
  }

  return newRhythmTrack;
};

const generateMelodyTrack = (
  synth: TrackSynth,
  scaleNotes: Array<string>
): TrackData => {
  const newMelodyTrack = makeNewTrack("Melody", synth);

  for (
    let beatNumber = 0;
    beatNumber < newMelodyTrack.beats.length;
    beatNumber++
  ) {
    if (Math.floor(Math.random() * 2) == 1) {
      const note = scaleNotes[Math.floor(Math.random() * scaleNotes.length)];
      const octave = Math.floor(Math.random() * 2) + 3;
      const newNote = `${note}${octave}`;

      newMelodyTrack.beats[beatNumber].label = newNote;
      newMelodyTrack.beats[beatNumber].beatData = [newNote];
      newMelodyTrack.beats[beatNumber].length = "8n";
      newMelodyTrack.beats[beatNumber].triggerTime = `+${Math.floor(
        beatNumber / BEATS_PER_BAR
      )}:${Math.floor(beatNumber % 4)}`;
    }
  }

  return newMelodyTrack;
};

export const generateBassDrumTrack = (
  songKey: string,
  synth: TrackSynth
): TrackData => {
  const newBassDrumTrack = makeNewTrack("Bass Drum", synth);
  const bassBeats = [0, 2];
  for (let bar = 0; bar < NUMBER_OF_BEATS / BEATS_PER_BAR; bar++) {
    bassBeats.forEach((bassBeat) => {
      const currentBeat = bar * BEATS_PER_BAR + bassBeat;
      newBassDrumTrack.beats[currentBeat].label = "B";
      newBassDrumTrack.beats[currentBeat].length = "8n";
      newBassDrumTrack.beats[currentBeat].beatData = [`C1`];
      newBassDrumTrack.beats[currentBeat].triggerTime = `+${bar}:${bassBeat}`;
    });
  }
  return newBassDrumTrack;
};

const generateSnareDrumTrack = (synth: TrackSynth): TrackData => {
  const newSnareDrumTrack = makeNewTrack("Snare Drum", synth);
  const snareBeats = [1, 3];
  for (let bar = 0; bar < NUMBER_OF_BEATS / BEATS_PER_BAR; bar++) {
    snareBeats.forEach((snareBeat) => {
      const currentBeat = bar * BEATS_PER_BAR + snareBeat;
      newSnareDrumTrack.beats[currentBeat].label = "S";
      newSnareDrumTrack.beats[currentBeat].length = "8n";
      newSnareDrumTrack.beats[currentBeat].triggerTime = `+${bar}:${snareBeat}`;
    });
  }
  return newSnareDrumTrack;
};

const generateClosedHiHatTrack = (synth: TrackSynth): TrackData => {
  const newClosedHiHatTrack = makeNewTrack("Closed Hi Hat", synth);
  let closedHiHatBeats = [0, 1, 2];
  for (let bar = 0; bar < 3; bar++) {
    closedHiHatBeats.forEach((closedHiHatBeat) => {
      const currentBeat = bar * BEATS_PER_BAR + closedHiHatBeat;
      newClosedHiHatTrack.beats[currentBeat].label = "CH";
      newClosedHiHatTrack.beats[currentBeat].length = "8n";
      newClosedHiHatTrack.beats[
        currentBeat
      ].triggerTime = `+${bar}:${closedHiHatBeat}`;
    });
  }

  closedHiHatBeats = [0, 2];
  closedHiHatBeats.forEach((closedHiHatBeat) => {
    const currentBeat = Math.floor(3 * BEATS_PER_BAR + closedHiHatBeat);
    newClosedHiHatTrack.beats[currentBeat].label = "CH";
    newClosedHiHatTrack.beats[currentBeat].length = "8n";
    newClosedHiHatTrack.beats[
      currentBeat
    ].triggerTime = `+${3}:${closedHiHatBeat}`;
  });

  return newClosedHiHatTrack;
};

const generateOpenHiHatTrack = (synth: TrackSynth): TrackData => {
  const newOpenHiHatTrack = makeNewTrack("Open Hi Hat", synth);
  let closedHiHatBeats = [2.5, 3];
  for (let bar = 0; bar < 3; bar++) {
    closedHiHatBeats.forEach((closedHiHatBeat) => {
      const currentBeat = Math.floor(bar * BEATS_PER_BAR + closedHiHatBeat);
      newOpenHiHatTrack.beats[currentBeat].label = "OH";
      newOpenHiHatTrack.beats[currentBeat].length = "8n";
      newOpenHiHatTrack.beats[
        currentBeat
      ].triggerTime = `+${bar}:${closedHiHatBeat}`;
    });
  }

  closedHiHatBeats = [1, 3];
  closedHiHatBeats.forEach((closedHiHatBeat) => {
    const currentBeat = Math.floor(3 * BEATS_PER_BAR + closedHiHatBeat);
    newOpenHiHatTrack.beats[currentBeat].label = "OH";
    newOpenHiHatTrack.beats[currentBeat].length = "8n";
    newOpenHiHatTrack.beats[
      currentBeat
    ].triggerTime = `+${3}:${closedHiHatBeat}`;
  });

  return newOpenHiHatTrack;
};

const generateBassTrack = (
  synth: TrackSynth,
  rhythmTrack: TrackData
): TrackData => {
  const newBassTrack = makeNewTrack("Bass", synth);

  const chords = [];
  for (let i = 0; i < newBassTrack.beats.length; i++) {
    if (rhythmTrack.beats[i].beatData.length) {
      chords.push(rhythmTrack.beats[i].beatData);
    }
  }

  for (let i = 0; i < chords.length; i++) {
    const chordNotes = chords[i];

    newBassTrack.beats[i * BEATS_PER_BAR].beatData = [
      `${chords[i][0].slice(0, -1)}2`,
    ];
    newBassTrack.beats[i * BEATS_PER_BAR].label = `${chords[i][0].slice(
      0,
      -1
    )}2`;
    newBassTrack.beats[i * BEATS_PER_BAR].length = "8n";
    newBassTrack.beats[i * BEATS_PER_BAR].triggerTime = `+${i}:0`;

    for (let measure = 1; measure < BEATS_PER_BAR; measure++) {
      if (Math.floor(Math.random() * 3) == 1) {
        const randomNote = `${chordNotes[
          Math.floor(Math.random() * chords[0].length)
        ].slice(0, -1)}2`;

        newBassTrack.beats[i * BEATS_PER_BAR + measure].beatData = [randomNote];
        newBassTrack.beats[i * BEATS_PER_BAR + measure].label = randomNote;
        newBassTrack.beats[i * BEATS_PER_BAR + measure].length = "8n";
        newBassTrack.beats[
          i * BEATS_PER_BAR + measure
        ].triggerTime = `+${i}:${measure}`;
      }
    }
  }

  return newBassTrack;
};

const generateGuitarRhythmTrack = async (
  progression: Array<ChordInfo>
): Promise<TrackData> => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const newGuitarRhythmTrack = makeNewTrack("Guitar", {
    meter: meter,
    fft: fft,
  });
  const chordsToFetch = progression.map((p) => p.chordName);
  newGuitarRhythmTrack.synth.samplePlayers = {};

  for (let i = 0; i < chordsToFetch.length; i++) {
    const newPlayer = new Tone.Player().fan(meter, fft).toDestination();
    const listOfChords = Object.keys(chordUrls);
    if (listOfChords.includes(chordsToFetch[i])) {
      await newPlayer.load(chordUrls[chordsToFetch[i]]);
      newPlayer.volume.value = -5;

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
  } else if (["i", "v"].includes(currentPosition.charAt(0))) {
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
  songSynths: SongSynths
): Promise<SongInfo> => {
  const scale = generateScaleNotes(songKey);
  const chordDetails = generateChordDetails(scale, songKey.progression);

  const progression = generatedRandomProgression(chordDetails);
  const rhythmTrack = generateRhythmTrack(progression, songSynths.rhythm);
  const melodyTrack = generateMelodyTrack(songSynths.lead, scale);
  const bassDrumTrack = generateBassDrumTrack(
    songKey.rootNote,
    songSynths.bassDrum
  );
  const snareDrumTrack = generateSnareDrumTrack(songSynths.snareDrum);
  const bassTrack = generateBassTrack(songSynths.bass, rhythmTrack);
  const closedHiHatTrack = generateClosedHiHatTrack(songSynths.closedHiHat);
  const openHiHatTrack = generateOpenHiHatTrack(songSynths.openHiHat);
  const guitarRhythmTrack = await generateGuitarRhythmTrack(progression);

  return {
    rhythmTrack: rhythmTrack,
    melodyTrack: melodyTrack,
    bassDrumTrack: bassDrumTrack,
    bassTrack: bassTrack,
    snareDrumTrack: snareDrumTrack,
    guitarRhythmTrack: guitarRhythmTrack,
    progression: progression,
    closedHiHatTrack: closedHiHatTrack,
    openHiHatTrack: openHiHatTrack,
  };
};
