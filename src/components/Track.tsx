import styled from "styled-components";
import { TrackData } from "../helpers/types/types";
import { Visualizer } from "./Visualizer";
import { MuteControl } from "./MuteControl";

type TrackProps = {
  trackData: TrackData;
};

const TrackContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  border-bottom: dashed #03c03c;
  height: 45px;
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
      <MuteControl trackVolume={trackData.synth.volumeControl} />
      <InstrumentLabel>{trackData.name}</InstrumentLabel>
      <Visualizer meter={trackData.synth.meter} fft={trackData.synth.fft} />
    </TrackContainer>
  );
};
