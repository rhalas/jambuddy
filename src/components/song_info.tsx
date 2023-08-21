import { KeyInfo, ChordInfo } from "../helpers/types/types";
import styled from "styled-components";

const SongInfoContainer = styled.div``;
const KeyInfoContainer = styled.div``;
const ProgressionContainer = styled.div``;

type SongInfoProps = {
  songKey: KeyInfo;
  progression: ChordInfo[];
};

export const SongInfo = (songInfoProps: SongInfoProps) => {
  const { songKey, progression } = songInfoProps;
  return (
    <SongInfoContainer>
      <KeyInfoContainer>
        Key: {songKey.rootNote} {songKey.progression}
      </KeyInfoContainer>
      <ProgressionContainer>
        Chord Progression:{" "}
        {progression &&
          progression.map((p: ChordInfo) => p.position).join(" - ")}
      </ProgressionContainer>
    </SongInfoContainer>
  );
};
