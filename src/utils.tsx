import { Beat, TrackData, NUMBER_OF_BEATS, TrackSynth } from "./types";

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
