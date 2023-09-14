import { Slider } from "@radix-ui/themes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";

type VolumeSliderProps = {
  volumeLevel: number;
  setVolumeLevel: Dispatch<SetStateAction<number>>;
};

const SliderContainer = styled.div`
  width: 300px;
  margin: auto;
  padding-bottom: 10px;
`;

export const VolumeSlider = (volumeSliderProps: VolumeSliderProps) => {
  const { volumeLevel, setVolumeLevel } = volumeSliderProps;
  const [displayVolume, setDisplayVolume] = useState<string>("");

  useEffect(() => {
    if (volumeLevel <= -40) {
      setDisplayVolume("0");
    } else {
      setDisplayVolume(`${volumeLevel + 40}`);
    }
  }, [volumeLevel, setDisplayVolume]);

  useEffect(() => {
    if (volumeLevel <= -40) {
      setVolumeLevel(-1000);
    }
  }, [volumeLevel, setVolumeLevel]);

  return (
    <SliderContainer>
      Volume: {displayVolume}
      <Slider
        defaultValue={[40]}
        max={100}
        step={1}
        onValueChange={(val: number[]) => {
          setVolumeLevel(val[0] - 40);
        }}
      />
    </SliderContainer>
  );
};
