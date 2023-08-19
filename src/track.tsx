import styled from "styled-components";
import { NUMBER_OF_BEATS, TrackData } from "./types";
import { Visualizer } from "./visualizer";

type TrackProps = {
  trackData: TrackData;
  currentBeat: number;
};

const TrackContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  border-bottom: dashed #03c03c;
`;

const InstrumentLabel = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  width: 100px;
`;

const Beats = styled.div`
  display: flex;
`;

const Square = styled.div<{ $isActive: boolean }>`
  height: 50px;
  width: 50px;
  margin-right: 10px;
  background-color: #555;
  color: chartreuse;
  text-align: center;
  vertical-align: middle;
  line-height: 50px;
  font-size: 15px;
  ${(props) =>
    props.$isActive ? "background-color: blue;" : "background-color: gray;"}
`;

export const Track = (trackProps: TrackProps) => {
  const { trackData, currentBeat } = trackProps;
  const beatsEnabaled = false;

  return (
    <TrackContainer>
      <InstrumentLabel>{trackData.name}</InstrumentLabel>
      <Visualizer meter={trackData.synth.meter} fft={trackData.synth.fft} />
      {beatsEnabaled && (
        <Beats>
          {trackData.beats.map((beat) => {
            return (
              <Square
                $isActive={Boolean(
                  beat.beatNumber === currentBeat % NUMBER_OF_BEATS &&
                    (beat.label || trackData.name === "Beat")
                )}
              >
                {beat.label}
              </Square>
            );
          })}
        </Beats>
      )}
    </TrackContainer>
  );
};
