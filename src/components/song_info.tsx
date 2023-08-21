import { KeyInfo, ChordInfo, TrackData } from "../helpers/types/types";
import styled from "styled-components";
import { exportToMidi } from "../helpers/music/midi";

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
        Key: {songKey.rootNote} {songKey.progression}
      </KeyInfoContainer>
      <ProgressionContainer>
        Chord Progression:{" "}
        {progression &&
          progression.map((p: ChordInfo) => p.position).join(" - ")}
      </ProgressionContainer>
      <button
        onClick={() => {
          exportToMidi(tracks, tempo);
        }}
      >
        Export MIDI
      </button>
    </SongInfoContainer>
  );
};
