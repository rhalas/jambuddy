import * as Tone from "tone";
import { MelodyPiece } from "./types";

export const makeSnareLoop = (snare: Tone.NoiseSynth) => {
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

export const makeBassDrumLoop = (bassDrum: Tone.MembraneSynth) => {
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
