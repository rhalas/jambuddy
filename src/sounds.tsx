import * as Tone from "tone";
import { MelodyPiece, BeatInfo, NUMBER_OF_BEATS } from "./types";

export const makeSnareLoop = (): Array<BeatInfo> => {
  const beats = new Array<BeatInfo>(NUMBER_OF_BEATS);
  for (let i = 0; i < NUMBER_OF_BEATS; i++) {
    beats[i] = { beatNumber: i, snareDrum: "" } as BeatInfo;
  }

  beats[1].snareDrum = "S";
  beats[3].snareDrum = "S";
  beats[5].snareDrum = "S";
  beats[7].snareDrum = "S";
  beats[9].snareDrum = "S";
  beats[11].snareDrum = "S";
  beats[13].snareDrum = "S";
  beats[15].snareDrum = "S";

  return beats;
};

export const playBassDrumLoop = (bassDrum: Tone.MembraneSynth) => {
  new Tone.Loop(() => {
    bassDrum!.triggerAttackRelease("C2", "8n", "+0:0");
    bassDrum!.triggerAttackRelease("C2", "8n", "+0:2");
    bassDrum!.triggerAttackRelease("C2", "8n", "+1:0");
    bassDrum!.triggerAttackRelease("C2", "8n", "+1:2");
    bassDrum!.triggerAttackRelease("C2", "8n", "+2:0");
    bassDrum!.triggerAttackRelease("C2", "8n", "+2:2");
    bassDrum!.triggerAttackRelease("C2", "8n", "+3:0");
    bassDrum!.triggerAttackRelease("C2", "8n", "+3:2");
  }, "4m").start(0);
};

export const playSnareDrumLoop = (snare: Tone.NoiseSynth) => {
  new Tone.Loop(() => {
    snare!.triggerAttackRelease("8n", "+0:1");
    snare!.triggerAttackRelease("8n", "+0:3");
    snare!.triggerAttackRelease("8n", "+1:1");
    snare!.triggerAttackRelease("8n", "+1:3");
    snare!.triggerAttackRelease("8n", "+2:1");
    snare!.triggerAttackRelease("8n", "+2:3");
    snare!.triggerAttackRelease("8n", "+3:1");
    snare!.triggerAttackRelease("8n", "+3:3");
  }, "4m").start(0);
};

export const makeBassDrumLoop = (): Array<BeatInfo> => {
  const beats = new Array<BeatInfo>(NUMBER_OF_BEATS);
  for (let i = 0; i < NUMBER_OF_BEATS; i++) {
    beats[i] = { beatNumber: i, bassDrum: "" } as BeatInfo;
  }
  beats[0].bassDrum = "B";
  beats[2].bassDrum = "B";
  beats[4].bassDrum = "B";
  beats[6].bassDrum = "B";
  beats[8].bassDrum = "B";
  beats[10].bassDrum = "B";
  beats[12].bassDrum = "B";
  beats[14].bassDrum = "B";

  return beats;
};

export const makeRhythmLoop = (
  rhythmSynth: Tone.PolySynth,
  chords: Array<Array<string>>
) => {
  new Tone.Loop(() => {
    let timeIdx = 0;
    chords.map((chord) => {
      rhythmSynth!.triggerAttackRelease(chord, "1n", `+${timeIdx}:0`);
      timeIdx += 1;
    });
  }, "4m").start(0);
};

export const makeMelodyLoop = (
  leadSynth: Tone.PolySynth,
  melody: Array<MelodyPiece>
) => {
  new Tone.Loop(() => {
    for (let i = 0; i < melody!.length; i++) {
      leadSynth!.triggerAttackRelease(melody![i].note, "8n", melody![i].beat);
    }
  }, "4m").start(0);
};

export const makeBassLoop = (
  bassSynth: Tone.PolySynth,
  chords: Array<Array<string>>
) => {
  const bassBeats = new Array<BeatInfo>();

  for (let bar = 0; bar < 4; bar++) {
    bassBeats.push({
      lead: `+${bar}:0`,
      bass: `${chords[bar][0].charAt(0)}1`,
      beatNumber: bar * 4,
    } as BeatInfo);
    for (let beat = 1; beat <= 3; beat++) {
      if (Math.floor(Math.random() * 3) == 1) {
        const randomNote =
          chords[bar][Math.floor(Math.random() * chords[0].length)];
        bassBeats.push({
          lead: `+${bar}:${beat}`,
          bass: `${randomNote.charAt(0)}1`,
          beatNumber: bar * 4 + beat,
        } as BeatInfo);
      }
    }
  }

  new Tone.Loop(() => {
    bassBeats.map((bassBeat) => {
      bassSynth!.triggerAttackRelease(bassBeat.bass, "8n", bassBeat.lead);
    });
  }, "4m").start(0);

  return bassBeats;
};
