import { ProgressionInfo, ChordInfo, TrackData } from "../helpers/types/types";
import styled from "styled-components";
import { exportToMidi } from "../helpers/music/midi";
import { Button, Text, Flex } from "@radix-ui/themes";

const SongInfoContainer = styled.div``;
const KeyInfoContainer = styled.div``;
const ProgressionContainer = styled.div`
  margin-bottom: 15px;
`;

type SongInfoProps = {
  songKey?: ProgressionInfo;
  tracks: Array<TrackData>;
  tempo: number;
  addNewChordCallback: () => void;
};

export const SongInfo = (songInfoProps: SongInfoProps) => {
  const { songKey, tracks, tempo, addNewChordCallback } = songInfoProps;
  return (
    songKey && (
      <SongInfoContainer>
        <KeyInfoContainer>
          <Text>
            Key: {songKey.rootNote} {songKey.mode}
          </Text>
        </KeyInfoContainer>
        <ProgressionContainer>
          <Text>
            Chord Progression:{" "}
            {songKey.progression &&
              songKey.progression.map((p: ChordInfo) => p.position).join(" - ")}
          </Text>
        </ProgressionContainer>
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
              exportToMidi(tracks, tempo);
            }}
          >
            <Text>Export MIDI</Text>
          </Button>
        </Flex>{" "}
      </SongInfoContainer>
    )
  );
};
