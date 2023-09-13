import { TrackData } from "../helpers/types/types";
import { Track } from "./Track";
import { Notation } from "./Notation";
import styled from "styled-components";
import { useEffect, useState } from "react";

type SequencerProps = {
  tracks: Array<TrackData>;
  showNotation: boolean;
};

const SequencerContainer = styled.div`
  width: 100%;
`;

export const Sequencer = (sequencerProps: SequencerProps) => {
  const { tracks, showNotation } = sequencerProps;
  const [tracksMuted, setTracksMuted] = useState<Array<boolean>>([]);

  useEffect(() => {
    setTracksMuted(
      tracks.map(() => {
        return false;
      })
    );
  }, [tracks]);

  return (
    <SequencerContainer>
      {showNotation ? (
        <Notation trackData={tracks} />
      ) : (
        tracks.map((track, idx) => {
          return (
            <Track
              key={track.name}
              trackNum={idx}
              trackData={track}
              tracksMuted={tracksMuted}
              setTracksMuted={setTracksMuted}
            />
          );
        })
      )}
    </SequencerContainer>
  );
};
