import { Beat, TrackData, TrackSynth } from "../types/types";
import {
  NUMBER_OF_BEATS,
  BEAT_LENGTH_TO_TONE_LENGTH,
} from "../types/music_types";

export const addNewBeatToTrack = (
  label: string,
  beatData: Array<string>,
  triggerTime: string,
  track: TrackData,
  beatLength: number,
  beatsSinceLastNote: Array<string>
) => {
  const newBeat = {
    beatNumber: track.beats.length,
    label: label,
    beatData: beatData,
    length: BEAT_LENGTH_TO_TONE_LENGTH[beatLength],
    triggerTime: triggerTime,
    beatLength: beatLength,
    beatsSinceLastNote: beatsSinceLastNote,
  };

  track.beats.push(newBeat);
};

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
