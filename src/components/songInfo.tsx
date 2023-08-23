import { ProgressionDetails } from "../helpers/types/types";
import styled from "styled-components";
import { exportToMidi } from "../helpers/music/midi";
import { Button, Text, Flex } from "@radix-ui/themes";
import { ProgressionInfo } from "./progressionInfo";

const SongInfoContainer = styled.div``;

type SongInfoProps = {
  progressions: Array<ProgressionDetails>;
  playingIndex: number;
  tempo: number;
  addNewChordCallback: () => void;
};

export const SongInfo = (songInfoProps: SongInfoProps) => {
  const { progressions, playingIndex, tempo, addNewChordCallback } =
    songInfoProps;
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
            <Text>Queue up a new song</Text>
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
        </Flex>{" "}
      </SongInfoContainer>
    )
  );
};
