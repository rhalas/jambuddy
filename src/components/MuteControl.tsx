import * as Tone from "tone";
import { Button } from "@radix-ui/themes";
import { useState } from "react";
import styled from "styled-components";

const ButtonContainer = styled(Button)`
  display: flex;
  width: 75px;
  margin-right: 10px;
`;

type MuteControlProps = {
  trackVolume: Tone.Volume;
};

export const MuteControl = (volumeSliderProps: MuteControlProps) => {
  const { trackVolume } = volumeSliderProps;
  const [trackMuted, setTrackMuted] = useState<boolean>(false);

  return (
    <ButtonContainer
      onClick={() => {
        trackVolume.volume.value = trackMuted ? 0 : -50;
        setTrackMuted((m) => !m);
      }}
    >
      {trackMuted ? "Unmute" : "Mute"}
    </ButtonContainer>
  );
};
