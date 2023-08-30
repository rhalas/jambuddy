import styled from "styled-components";
import { TrackData } from "../helpers/types/types";
import { Visualizer } from "./visualizer";

type TrackProps = {
  trackData: TrackData;
};

const TrackContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  border-bottom: dashed #03c03c;
  height: 50px;
`;

const InstrumentLabel = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  width: 100px;
`;

export const Track = (trackProps: TrackProps) => {
  const { trackData } = trackProps;

  return (
    <TrackContainer>
      <InstrumentLabel>{trackData.name}</InstrumentLabel>
      <Visualizer meter={trackData.synth.meter} fft={trackData.synth.fft} />
    </TrackContainer>
  );
};
