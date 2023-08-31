import { TrackData } from "../helpers/types/types";
import { Track } from "./Track";

type SequencerProps = {
  tracks: Array<TrackData>;
};

export const Sequencer = (sequencerProps: SequencerProps) => {
  const { tracks } = sequencerProps;
  return tracks.map((track) => {
    return <Track trackData={track} />;
  });
};
