import { KeyInfo, ChordInfo, TrackData } from "../helpers/types/types";
import styled from "styled-components";
import { exportToMidi } from "../helpers/music/midi";
import { Button, Text } from "@radix-ui/themes";
const SongInfoContainer = styled.div``;
const KeyInfoContainer = styled.div``;
const ProgressionContainer = styled.div``;

type SongInfoProps = {
  songKey: KeyInfo;
  progression: ChordInfo[];
  tracks: Array<TrackData>;
  tempo: number;
};

export const SongInfo = (songInfoProps: SongInfoProps) => {
  const { songKey, progression, tracks, tempo } = songInfoProps;
  return (
    <SongInfoContainer>
      <KeyInfoContainer>
        <Text>
          Key: {songKey.rootNote} {songKey.progression}
        </Text>
      </KeyInfoContainer>
      <ProgressionContainer>
        <Text>
          Chord Progression:{" "}
          {progression &&
            progression.map((p: ChordInfo) => p.position).join(" - ")}
        </Text>
      </ProgressionContainer>
      <Button
        size="3"
        variant="classic"
        onClick={() => {
          exportToMidi(tracks, tempo);
        }}
      >
        <Text>Export MIDI</Text>
      </Button>
    </SongInfoContainer>
  );
};
