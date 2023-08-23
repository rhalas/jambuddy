import * as Tone from "tone";
import { Beat, TrackSynth } from "../types/types";
import { NUMBER_OF_BARS } from "../types/music_types";

export const makeTrackLoop = (
  synth: TrackSynth,
  beats: Array<Beat>
): Tone.Loop => {
  const loop = new Tone.Loop(() => {
    beats.forEach((beat) => {
      if (beat.length) {
        if (synth.polySynth) {
          synth.polySynth.triggerAttackRelease(
            beat.beatData,
            beat.length,
            beat.triggerTime
          );
        } else if (synth.membraneSynth) {
          synth.membraneSynth.triggerAttackRelease(
            beat.beatData[0],
            beat.length,
            beat.triggerTime
          );
        } else if (synth.noiseSynth) {
          synth.noiseSynth.triggerAttackRelease(beat.length, beat.triggerTime);
        } else if (synth.samplePlayers) {
          if (beat.label) {
            const currentPlayer = synth.samplePlayers[beat.label];
            currentPlayer.start(beat.triggerTime, 0, beat.length);
          }
        }
      }
    });
  }, `${NUMBER_OF_BARS}m`).start(0);

  return loop;
};