import { ProgressionDetails } from "../helpers/types/types";
import styled from "styled-components";
import { exportToMidi } from "../helpers/music/midi";
import { Button, Text, Flex } from "@radix-ui/themes";
import { ProgressionInfo } from "./ProgressionInfo";
import { CaretDownIcon, CheckIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Output } from "webmidi";
import { Dispatch, SetStateAction } from "react";

const SongInfoContainer = styled.div``;

type SongInfoProps = {
  progressions: Array<ProgressionDetails>;
  playingIndex: number;
  tempo: number;
  addNewChordCallback: () => void;
  showNotation: boolean;
  setShowNotation: Dispatch<SetStateAction<boolean>>;
  midiOutputs: Array<Output>;
};

export const SongInfo = (songInfoProps: SongInfoProps) => {
  const {
    progressions,
    playingIndex,
    tempo,
    addNewChordCallback,
    midiOutputs,
    showNotation,
    setShowNotation,
  } = songInfoProps;

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
              setShowNotation((s) => !s);
            }}
          >
            <Text>{showNotation ? "Show Visualization" : "Show Notation"}</Text>
          </Button>
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
              {midiOutputs.map((outputDevice, index) => {
                return (
                  <DropdownMenu.CheckboxItem
                    className="DropdownMenuCheckboxItem"
                    checked={index == 0}
                    key={index}
                  >
                    <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                      <CheckIcon />
                    </DropdownMenu.ItemIndicator>
                    {outputDevice.name}
                  </DropdownMenu.CheckboxItem>
                );
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>{" "}
      </SongInfoContainer>
    )
  );
};
