import styled from "styled-components";
import { TrackData } from "../helpers/types/types";
import { Visualizer } from "./Visualizer";
import { MuteControl } from "./MuteControl";
import { Dispatch, SetStateAction, useCallback } from "react";

type TrackProps = {
  trackData: TrackData;
  tracksMuted: Array<boolean>;
  setTracksMuted: Dispatch<SetStateAction<Array<boolean>>>;
  trackNum: number;
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
  const { trackData, tracksMuted, setTracksMuted, trackNum } = trackProps;

  const muteCallback = useCallback(() => {
    const newState = [...tracksMuted];
    newState[trackNum] = !tracksMuted[trackNum];
    setTracksMuted(newState);
  }, [setTracksMuted, tracksMuted, trackNum]);

  return (
    <TrackContainer>
      <MuteControl
        trackVolume={trackData.synth.volumeControl}
        trackMuted={tracksMuted[trackNum]}
        muteCallback={muteCallback}
      />
      <InstrumentLabel>{trackData.name}</InstrumentLabel>
      <Visualizer meter={trackData.synth.meter} fft={trackData.synth.fft} />
    </TrackContainer>
  );
};
