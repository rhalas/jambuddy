import { Slider } from "@radix-ui/themes";
import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

type VolumeSliderProps = {
  volumeLevel: number;
  setVolumeLevel: Dispatch<SetStateAction<number>>;
};

const SliderContainer = styled.div`
  width: 300px;
  margin: auto;
`;

export const VolumeSlider = (volumeSliderProps: VolumeSliderProps) => {
  const { volumeLevel, setVolumeLevel } = volumeSliderProps;

  return (
    <SliderContainer>
      Volume: {volumeLevel + 40}
      <Slider
        defaultValue={[40]}
        max={80}
        step={1}
        onValueChange={(val: number[]) => {
          setVolumeLevel(val[0] - 40);
        }}
      />
    </SliderContainer>
  );
};
