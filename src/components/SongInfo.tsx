import { ProgressionDetails } from "../helpers/types/types";
import styled from "styled-components";
import { exportToMidi } from "../helpers/music/midi";
import { Button, Text, Flex } from "@radix-ui/themes";
import { ProgressionInfo } from "./ProgressionInfo";
import { WebMidi, Output } from "webmidi";
const SongInfoContainer = styled.div``;
import { useEffect, useState } from "react";
import { CaretDownIcon, CheckIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

type SongInfoProps = {
  progressions: Array<ProgressionDetails>;
  playingIndex: number;
  tempo: number;
  addNewChordCallback: () => void;
};

export const SongInfo = (songInfoProps: SongInfoProps) => {
  const { progressions, playingIndex, tempo, addNewChordCallback } =
    songInfoProps;
  const [outputDevices, setOutputDevices] = useState<Array<Output>>([]);

  useEffect(() => {
    WebMidi.enable()
      .then(() => {
        const outputs: Array<Output> = [];
        WebMidi.outputs.forEach((output) => {
          outputs.push(output);
        });
        setOutputDevices(outputs);
      })
      .catch((err) => alert(err));
  }, []);

  return (
    progressions && (
      <SongInfoContainer>
        <ProgressionInfo
          progressions={progressions}
          playingIndex={playingIndex}
        />
        <Flex justify="center" align="center" gap="9" style={{ height: 40 }}>
          <Button
            size="3"
            variant="classic"
            onClick={() => {
              addNewChordCallback();
            }}
          >
            <Text>Add more music</Text>
          </Button>
          <Button
            size="3"
            variant="classic"
            onClick={() => {
              exportToMidi(progressions[playingIndex].tracks, tempo);
            }}
          >
            <Text>Export MIDI</Text>
          </Button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button size="3" variant="classic">
                MIDI Outputs
                <CaretDownIcon />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {outputDevices.map((outputDevice) => {
                return (
                  <>
                    <DropdownMenu.CheckboxItem
                      className="DropdownMenuCheckboxItem"
                      checked={true}
                    >
                      <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                        <CheckIcon />
                      </DropdownMenu.ItemIndicator>
                      {outputDevice.name}
                    </DropdownMenu.CheckboxItem>
                  </>
                );
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>{" "}
      </SongInfoContainer>
    )
  );
};
