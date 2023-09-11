import {
  ChordInfo,
  SongInfo,
  TrackData,
  ProgressionDetails,
  SongSynths,
  TrackSynth,
  Beat,
} from "../types/types";
import {
  BEATS_PER_BAR,
  NUMBER_OF_BEATS,
  chordUrls,
  DEFAULT_TRACK_VOLUME,
} from "../types/music_types";
import { makeNewTrack, addNewBeatToTrack } from "../utils/track_utils";
import * as Tone from "tone";
import { getABeatLength, beatToTriggerTime } from "./music";

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
      4
    );
  }

  return newRhythmTrack;
};

const generateMelodyTrack = (
  synth: TrackSynth,
  scaleNotes: Array<string>
): TrackData => {
  const newMelodyTrack = makeNewTrack("Melody", synth);
  let nextBeatLength = getABeatLength();
  let currentBeat = 0;

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
        Number(nextBeatLength)
      );
    }
    currentBeat += Number(nextBeatLength);
    nextBeatLength = getABeatLength();
  } while (currentBeat + Number(nextBeatLength) < NUMBER_OF_BEATS);

  return newMelodyTrack;
};

const generateVocalTrack = (
  synth: TrackSynth,
  scaleNotes: Array<string>
): TrackData => {
  const newMelodyTrack = makeNewTrack("Vocals", synth);
  let nextBeatLength = getABeatLength();
  let currentBeat = 0;

  do {
    let newNote = "";
    if (Math.floor(Math.random() * 2) == 1) {
      const note = scaleNotes[Math.floor(Math.random() * scaleNotes.length)];
      const octave = 4;
      newNote = `${note}${octave}`;

      addNewBeatToTrack(
        newNote,
        [newNote],
        beatToTriggerTime(currentBeat),
        newMelodyTrack,
        Number(nextBeatLength)
      );
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
        0.5
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
        0.5
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
        0.25
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
      0.25
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
        0.25
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
      0.25
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

  let nextBeatLength = "";

  for (let i = 0; i < chords.length; i++) {
    const chordNotes = chords[i];

    addNewBeatToTrack(
      `${chords[i][1].slice(0, -1)}2`,
      [`${chords[i][1].slice(0, -1)}2`],
      `+${i}:0`,
      newBassTrack,
      1
    );

    nextBeatLength = getABeatLength();
    let currentBeat = 1;

    do {
      if (Math.floor(Math.random() * 2) == 1) {
        const randomNote = `${chordNotes[
          Math.floor(Math.random() * chords[0].length)
        ].slice(0, -1)}2`;

        addNewBeatToTrack(
          randomNote,
          [randomNote],
          beatToTriggerTime(currentBeat + i * BEATS_PER_BAR),
          newBassTrack,
          Number(nextBeatLength)
        );
      }

      currentBeat += Number(nextBeatLength);
      nextBeatLength = getABeatLength();
    } while (currentBeat + Number(nextBeatLength) < 3);
  }
  return newBassTrack;
};

const generateGuitarRhythmTrack = async (
  progression: Array<ChordInfo>,
  masterVol: Tone.Volume
): Promise<TrackData> => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const vol = new Tone.Volume(DEFAULT_TRACK_VOLUME).connect(masterVol);
  const newGuitarRhythmTrack = makeNewTrack("Guitar", {
    meter: meter,
    fft: fft,
    volumeControl: vol,
  });
  const chordsToFetch = progression.map((p) => p.chordName);
  newGuitarRhythmTrack.synth.samplePlayers = {};

  for (let i = 0; i < chordsToFetch.length; i++) {
    const newPlayer = new Tone.Player().fan(meter, fft).connect(masterVol);
    const listOfChords = Object.keys(chordUrls);
    if (listOfChords.includes(chordsToFetch[i])) {
      await newPlayer.load(chordUrls[chordsToFetch[i]]);
      newPlayer.volume.value = DEFAULT_TRACK_VOLUME;

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

export const createSongTracks = async (
  progressionDetails: ProgressionDetails,
  songSynths: SongSynths
): Promise<SongInfo> => {
  const rhythmTrack = generateRhythmTrack(
    progressionDetails.progression,
    songSynths.rhythm
  );
  const melodyTrack = generateMelodyTrack(
    songSynths.lead,
    progressionDetails.scale
  );
  const bassDrumTrack = generateBassDrumTrack(songSynths.bassDrum);
  const snareDrumTrack = generateSnareDrumTrack(songSynths.snareDrum);
  const closedHiHatTrack = generateClosedHiHatTrack(songSynths.closedHiHat);
  const openHiHatTrack = generateOpenHiHatTrack(songSynths.openHiHat);
  const bassTrack = generateBassTrack(songSynths.bass, rhythmTrack);
  const guitarRhythmTrack = await generateGuitarRhythmTrack(
    progressionDetails.progression,
    songSynths.masterVol
  );
  const vocalTrack = generateVocalTrack(
    songSynths.vocal,
    progressionDetails.scale
  );

  return {
    rhythmTrack: rhythmTrack,
    melodyTrack: melodyTrack,
    vocalTrack: vocalTrack,
    bassTrack: bassTrack,
    bassDrumTrack: bassDrumTrack,
    snareDrumTrack: snareDrumTrack,
    guitarRhythmTrack: guitarRhythmTrack,
    closedHiHatTrack: closedHiHatTrack,
    openHiHatTrack: openHiHatTrack,
  };
};
