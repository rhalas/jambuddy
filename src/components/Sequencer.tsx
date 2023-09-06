import { TrackData } from "../helpers/types/types";
import { Track } from "./Track";
import { Notation } from "./Notation";
import styled from "styled-components";

type SequencerProps = {
  tracks: Array<TrackData>;
  showNotation: boolean;
};

const SequencerContainer = styled.div`
  width: 100%;
`;

export const Sequencer = (sequencerProps: SequencerProps) => {
  const { tracks, showNotation } = sequencerProps;

  return (
    <SequencerContainer>
      {showNotation ? (
        <Notation trackData={tracks} />
      ) : (
        tracks.map((track) => {
          return <Track key={track.name} trackData={track} />;
        })
      )}
    </SequencerContainer>
  );
};
