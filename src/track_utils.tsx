import { TrackData } from "./types";
import { BEAT_LENGTH_TO_TONE_LENGTH } from "./music_types";

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
