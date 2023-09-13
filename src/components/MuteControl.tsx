import * as Tone from "tone";
import { Button } from "@radix-ui/themes";
import styled from "styled-components";

const ButtonContainer = styled(Button)`
  display: flex;
  width: 75px;
  margin-right: 10px;
`;

type MuteControlProps = {
  trackVolume: Tone.Volume;
  trackMuted: boolean;
  muteCallback: () => void;
};

export const MuteControl = (volumeSliderProps: MuteControlProps) => {
  const { trackVolume, trackMuted, muteCallback } = volumeSliderProps;

  return (
    <ButtonContainer
      onClick={() => {
        trackVolume.volume.value = trackMuted ? 0 : -50;
        muteCallback();
      }}
    >
      {trackMuted ? "Unmute" : "Mute"}
    </ButtonContainer>
  );
};
