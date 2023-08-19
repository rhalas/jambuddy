import { Beat, TrackData, NUMBER_OF_BEATS, TrackSynth } from "./types";

export const makeNewTrack = (
  trackName: string,
  synth: TrackSynth
): TrackData => {
  const newBeats = new Array<Beat>(NUMBER_OF_BEATS);
  for (let i = 0; i < newBeats.length; i++) {
    newBeats[i] = { beatNumber: i } as Beat;
  }

  return { beats: newBeats, name: trackName, synth: synth };
};
