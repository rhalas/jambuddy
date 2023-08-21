import { TrackData } from "../helpers/types/types";
import { Track } from "./track";

type SequencerProps = {
  tracks: Array<TrackData>;
  currentBeat: number;
};

export const Sequencer = (sequencerProps: SequencerProps) => {
  const { tracks, currentBeat } = sequencerProps;
  return tracks.map((track) => {
    return <Track trackData={track} currentBeat={currentBeat} />;
  });
};
