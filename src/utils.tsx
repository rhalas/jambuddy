import { Beat, TrackData, TrackSynth } from "./types";
import { NUMBER_OF_BEATS } from "./music_types";

export const makeNewTrack = (
  trackName: string,
  synth: TrackSynth
): TrackData => {
  return {
    beats: new Array<Beat>(),
    name: trackName,
    synth: synth,
    totalBeats: NUMBER_OF_BEATS,
  };
};
