import styled from "styled-components";
import { Beat, TrackData } from "./types";

type TrackProps = {
  trackData: TrackData;
  currentBeat: number;
};

const TrackContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const InstrumentLabel = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const Beats = styled.div`
  display: flex;
`;

const Square = styled.div<{ $isActive: boolean }>`
  height: 25px;
  width: 25px;
  margin-right: 10px;
  background-color: #555;
  color: chartreuse;
  ${(props) =>
    props.$isActive ? "background-color: blue;" : "background-color: gray;"}
`;

export const Track = (trackProps: TrackProps) => {
  const { trackData, currentBeat } = trackProps;

  return (
    <TrackContainer>
      <InstrumentLabel>{trackData.name}</InstrumentLabel>
      <Beats>
        {trackData.beats.map((beat) => {
          return (
            <Square $isActive={beat.beatNumber === currentBeat % 16}> </Square>
          );
        })}
      </Beats>
    </TrackContainer>
  );
};
