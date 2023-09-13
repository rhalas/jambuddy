import { ProgressionDetails, NewLoopType } from "../helpers/types/types";
import styled from "styled-components";
import { exportToMidi } from "../helpers/music/midi";
import { Button, Text, Flex } from "@radix-ui/themes";
import { ProgressionInfo } from "./ProgressionInfo";
import { CaretDownIcon, CheckIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Output } from "webmidi";
import { Dispatch, SetStateAction } from "react";

const SongInfoContainer = styled.div`
  overflow-x: hidden;
  height: 175px;
`;

const MidiOutputContainer = styled(Button)`
  padding: 0;
`;

const ControlBar = styled.div`
  margin-top: 20px;
`;

const DropDownContent = styled(DropdownMenu.Content)`
  min-width: 220px;
  background-color: white;
  border-radius: 6px;
  padding: 5px;CaretDownIcon
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35),
    0px 10px 20px -15px rgba(22, 23, 24, 0.2);
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
`;

const DropdownCheckboxItem = styled(DropdownMenu.CheckboxItem)`
  cursor: pointer;
  &:hover {
    background-color: lightblue;
  }
`;

type SongInfoProps = {
  progressions: Array<ProgressionDetails>;
  playingIndex: number;
  tempo: number;
  addNewLoopCallback: (
    newLoopType: NewLoopType,
    progressionUpdateIndex?: number,
    newMode?: string,
    newRoot?: string
  ) => void;
  showNotation: boolean;
  setShowNotation: Dispatch<SetStateAction<boolean>>;
  midiOutputs: Array<Output>;
  deleteProgressionCallback: (idx: number) => void;
  queueProgressionCallback: (idx: number) => void;
  loopOnDeck: number;
  currentChordPosition: number;
  editModeIndex: number;
  setEditModeIndex: Dispatch<SetStateAction<number>>;
  activeMidiDevice: number;
  setActiveMidiDevice: Dispatch<SetStateAction<number>>;
};

export const SongInfo = (songInfoProps: SongInfoProps) => {
  const {
    progressions,
    playingIndex,
    tempo,
    addNewLoopCallback,
    midiOutputs,
    showNotation,
    setShowNotation,
    deleteProgressionCallback,
    queueProgressionCallback,
    loopOnDeck,
    currentChordPosition,
    editModeIndex,
    setEditModeIndex,
    setActiveMidiDevice,
    activeMidiDevice,
  } = songInfoProps;

  return (
    progressions && (
      <SongInfoContainer>
        <ProgressionInfo
          progressions={progressions}
          playingIndex={playingIndex}
          deleteProgressionCallback={deleteProgressionCallback}
          loopOnDeck={loopOnDeck}
          queueProgressionCallback={queueProgressionCallback}
          currentChordPosition={currentChordPosition}
          editModeIndex={editModeIndex}
          setEditModeIndex={setEditModeIndex}
          updateLoop={(
            progressionIdx?: number,
            newMode?: string,
            newRoot?: string
          ) => {
            addNewLoopCallback(
              "update_existing",
              progressionIdx,
              newMode,
              newRoot
            );
          }}
        />
        <ControlBar>
          <Flex justify="center" align="center" gap="9" style={{ height: 40 }}>
            <Button
              size="3"
              variant="solid"
              onClick={() => {
                setShowNotation((s) => !s);
              }}
            >
              <Text>
                {showNotation ? "Show Visualization" : "Show Notation"}
              </Text>
            </Button>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <MidiOutputContainer size="3" variant="solid">
                  Add a new loop
                  <CaretDownIcon />
                </MidiOutputContainer>
              </DropdownMenu.Trigger>
              <DropDownContent>
                <DropdownCheckboxItem
                  onClick={() => addNewLoopCallback("clone_current")}
                >
                  <Text>Clone current</Text>
                </DropdownCheckboxItem>
                <DropdownCheckboxItem
                  onClick={() => addNewLoopCallback("same_key")}
                >
                  <Text>Same key</Text>
                </DropdownCheckboxItem>
                <DropdownCheckboxItem
                  onClick={() => addNewLoopCallback("random_key")}
                >
                  <Text>New key</Text>
                </DropdownCheckboxItem>
              </DropDownContent>
            </DropdownMenu.Root>
            <Button
              size="3"
              variant="solid"
              onClick={() => {
                exportToMidi(progressions[playingIndex].tracks, tempo);
              }}
            >
              <Text>Export MIDI</Text>
            </Button>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <MidiOutputContainer size="3" variant="solid">
                  MIDI Outputs
                  <CaretDownIcon />
                </MidiOutputContainer>
              </DropdownMenu.Trigger>
              <DropDownContent>
                {midiOutputs.map((outputDevice, index) => {
                  return (
                    <DropdownCheckboxItem
                      checked={index == activeMidiDevice}
                      key={index}
                      onClick={() => setActiveMidiDevice(index)}
                    >
                      <DropdownMenu.ItemIndicator>
                        {activeMidiDevice === index && <CheckIcon />}
                      </DropdownMenu.ItemIndicator>
                      {outputDevice.name}
                    </DropdownCheckboxItem>
                  );
                })}
              </DropDownContent>
            </DropdownMenu.Root>
          </Flex>{" "}
        </ControlBar>
      </SongInfoContainer>
    )
  );
};
