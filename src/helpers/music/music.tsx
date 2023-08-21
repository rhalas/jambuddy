import {
  ChordInfo,
  SongInfo,
  TrackData,
  KeyInfo,
  SongSynths,
  TrackSynth,
  Beat,
} from "../types/types";
import {
  NUMBER_OF_BARS,
  BEATS_PER_BAR,
  NUMBER_OF_BEATS,
  chordUrls,
  notes,
  scales,
  progressions,
  BEAT_LENGTHS,
  BEAT_LENGTH_TO_MIDI,
} from "../types/music_types";
import { makeNewTrack, addNewBeatToTrack } from "../utils/track_utils";
import * as Tone from "tone";

const generatedRandomProgression = (
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

export const generateRhythmTrack = (
  chordProgression: Array<ChordInfo>,
  synth: TrackSynth
): TrackData => {
  const newRhythmTrack = makeNewTrack("Pads", synth);

  for (let i = 0; i < chordProgression.length; i++) {
    addNewBeatToTrack(
      chordProgression[i].chordName,
      chordProgression[i].notes,
      `+${i}:0`,
      newRhythmTrack,
      4,
      []
    );
  }

  return newRhythmTrack;
};

const getABeatLength = () => {
  return BEAT_LENGTHS[Math.floor(Math.random() * BEAT_LENGTHS.length)];
};

const beatToTriggerTime = (currentBeat: number): string => {
  const measure = Math.floor(currentBeat / BEATS_PER_BAR);
  const beat = currentBeat % 4;
  return `+${measure}:${beat}`;
};

const generateMelodyTrack = (
  synth: TrackSynth,
  scaleNotes: Array<string>
): TrackData => {
  const newMelodyTrack = makeNewTrack("Melody", synth);
  let nextBeatLength = getABeatLength();
  let currentBeat = 0;
  let beatsSinceLastNote = [];
  do {
    let newNote = "";
    if (Math.floor(Math.random() * 2) == 1) {
      const note = scaleNotes[Math.floor(Math.random() * scaleNotes.length)];
      const octave = Math.floor(Math.random() * 2) + 3;
      newNote = `${note}${octave}`;

      addNewBeatToTrack(
        newNote,
        [newNote],
        beatToTriggerTime(currentBeat),
        newMelodyTrack,
        Number(nextBeatLength),
        beatsSinceLastNote
      );

      beatsSinceLastNote = [];
    } else {
      beatsSinceLastNote.push(BEAT_LENGTH_TO_MIDI[nextBeatLength]);
    }
    currentBeat += Number(nextBeatLength);
    nextBeatLength = getABeatLength();
  } while (currentBeat + Number(nextBeatLength) < NUMBER_OF_BEATS);

  return newMelodyTrack;
};

export const generateBassDrumTrack = (synth: TrackSynth): TrackData => {
  const newBassDrumTrack = makeNewTrack("Bass Drum", synth);
  const bassBeats = [0, 2];
  for (let bar = 0; bar < NUMBER_OF_BEATS / BEATS_PER_BAR; bar++) {
    bassBeats.forEach((bassBeat) => {
      addNewBeatToTrack(
        "B",
        ["C1"],
        `+${bar}:${bassBeat}`,
        newBassDrumTrack,
        0.25,
        newBassDrumTrack.beats.length === 0 ? [] : [BEAT_LENGTH_TO_MIDI["0.25"]]
      );
    });
  }
  return newBassDrumTrack;
};

const generateSnareDrumTrack = (synth: TrackSynth): TrackData => {
  const newSnareDrumTrack = makeNewTrack("Snare Drum", synth);
  const snareBeats = [1, 3];
  for (let bar = 0; bar < NUMBER_OF_BEATS / BEATS_PER_BAR; bar++) {
    snareBeats.forEach((snareBeat) => {
      addNewBeatToTrack(
        "S",
        ["C1"],
        `+${bar}:${snareBeat}`,
        newSnareDrumTrack,
        0.25,
        newSnareDrumTrack.beats.length === 0
          ? []
          : [BEAT_LENGTH_TO_MIDI["0.25"]]
      );
    });
  }

  return newSnareDrumTrack;
};

const generateClosedHiHatTrack = (synth: TrackSynth): TrackData => {
  const newClosedHiHatTrack = makeNewTrack("Closed Hi Hat", synth);
  let closedHiHatBeats = [0, 1, 2];

  for (let bar = 0; bar < NUMBER_OF_BEATS / BEATS_PER_BAR - 1; bar++) {
    closedHiHatBeats.forEach((closedHiHatBeat) => {
      addNewBeatToTrack(
        "CH",
        ["C1"],
        `+${bar}:${closedHiHatBeat}`,
        newClosedHiHatTrack,
        0.25,
        newClosedHiHatTrack.beats.length === 0
          ? []
          : [BEAT_LENGTH_TO_MIDI["0.25"]]
      );
    });
  }

  closedHiHatBeats = [0, 2];
  closedHiHatBeats.forEach((closedHiHatBeat) => {
    addNewBeatToTrack(
      "CH",
      ["C1"],
      `+${3}:${closedHiHatBeat}`,
      newClosedHiHatTrack,
      0.25,
      newClosedHiHatTrack.beats.length === 0
        ? []
        : [BEAT_LENGTH_TO_MIDI["0.25"]]
    );
  });

  return newClosedHiHatTrack;
};

const generateOpenHiHatTrack = (synth: TrackSynth): TrackData => {
  const newOpenHiHatTrack = makeNewTrack("Open Hi Hat", synth);
  let openHiHatBeats = [2.5, 3];
  for (let bar = 0; bar < 3; bar++) {
    openHiHatBeats.forEach((openHiHatBeat) => {
      addNewBeatToTrack(
        "OH",
        ["C1"],
        `+${bar}:${openHiHatBeat}`,
        newOpenHiHatTrack,
        0.25,
        newOpenHiHatTrack.beats.length === 0
          ? []
          : [BEAT_LENGTH_TO_MIDI["0.25"]]
      );
    });
  }

  openHiHatBeats = [1, 3];
  openHiHatBeats.forEach((openHiHatBeat) => {
    addNewBeatToTrack(
      "OH",
      ["C1"],
      `+${3}:${openHiHatBeat}`,
      newOpenHiHatTrack,
      0.25,
      newOpenHiHatTrack.beats.length === 0 ? [] : [BEAT_LENGTH_TO_MIDI["0.25"]]
    );
  });

  return newOpenHiHatTrack;
};

const generateBassTrack = (
  synth: TrackSynth,
  rhythmTrack: TrackData
): TrackData => {
  const newBassTrack = makeNewTrack("Bass", synth);

  const chords = [];
  for (let i = 0; i < rhythmTrack.beats.length; i++) {
    if (rhythmTrack.beats[i].beatData.length) {
      chords.push(rhythmTrack.beats[i].beatData);
    }
  }

  let beatsSinceLastNote = [];
  let nextBeatLength = "";

  for (let i = 0; i < chords.length; i++) {
    const chordNotes = chords[i];

    if (nextBeatLength) {
      beatsSinceLastNote.push(BEAT_LENGTH_TO_MIDI[nextBeatLength]);
    }

    addNewBeatToTrack(
      `${chords[i][0].slice(0, -1)}2`,
      [`${chords[i][0].slice(0, -1)}2`],
      `+${i}:0`,
      newBassTrack,
      1,
      beatsSinceLastNote
    );
    beatsSinceLastNote = [];

    nextBeatLength = getABeatLength();
    let currentBeat = 1;
    beatsSinceLastNote.push(BEAT_LENGTH_TO_MIDI["1"]);

    do {
      if (Math.floor(Math.random() * 3) == 1) {
        const randomNote = `${chordNotes[
          Math.floor(Math.random() * chords[0].length)
        ].slice(0, -1)}2`;

        addNewBeatToTrack(
          randomNote,
          [randomNote],
          beatToTriggerTime(currentBeat + i * BEATS_PER_BAR),
          newBassTrack,
          Number(nextBeatLength),
          beatsSinceLastNote
        );
        beatsSinceLastNote = [];
      } else {
        beatsSinceLastNote.push(BEAT_LENGTH_TO_MIDI[nextBeatLength]);
      }

      currentBeat += Number(nextBeatLength);
      nextBeatLength = getABeatLength();
    } while (currentBeat + Number(nextBeatLength) < 3);
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
      newPlayer.volume.value = -7;

      newGuitarRhythmTrack.beats.push({
        label: chordsToFetch[i],
        length: "1n",
        triggerTime: `+${i}:0`,
      } as Beat);
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
  const bassDrumTrack = generateBassDrumTrack(songSynths.bassDrum);
  const snareDrumTrack = generateSnareDrumTrack(songSynths.snareDrum);
  const closedHiHatTrack = generateClosedHiHatTrack(songSynths.closedHiHat);
  const openHiHatTrack = generateOpenHiHatTrack(songSynths.openHiHat);
  const bassTrack = generateBassTrack(songSynths.bass, rhythmTrack);
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
