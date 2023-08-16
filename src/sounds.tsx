import * as Tone from "tone";
import { NUMBER_OF_BARS, BEATS_PER_BAR, Beat, TrackSynth } from "./types";

export const makeTrackLoop = (synth: TrackSynth, beats: Array<Beat>) => {
  Tone.Transport.bpm.value = 160;

  new Tone.Loop(() => {
    beats.forEach((beat) => {
      if (beat.length) {
        const bar = Math.floor(beat.beatNumber / BEATS_PER_BAR);
        const measure = Math.floor(beat.beatNumber % 4);

        if (synth.polySynth) {
          synth.polySynth.triggerAttackRelease(
            beat.beatData,
            beat.length,
            `+${bar}:${measure}`
          );
        } else if (synth.membraneSynth) {
          synth.membraneSynth.triggerAttackRelease(
            beat.beatData[0],
            beat.length,
            `+${bar}:${measure}`
          );
        } else if (synth.noiseSynth) {
          synth.noiseSynth.triggerAttackRelease(
            beat.length,
            `+${bar}:${measure}`
          );
        }
      }
    });
  }, `${NUMBER_OF_BARS}m`).start(0);
};
