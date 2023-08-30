import styled from "styled-components";
import { SongInfo } from "./songInfo";
import { Sequencer } from "./sequencer";
import { ProgressionDetails, SongSynths } from "../helpers/types/types";
import { Lyrics } from "./Lyrics";
import { LyricLine } from "../helpers/api/api";

const SongPlayerContainer = styled.div`
  display: flex;
`;

const SongDetailsContainer = styled.div`
  flex: 1;
`;

const LyricsContainer = styled.div`
  flex: 1;
  margin: auto;
  margin-left: 40px;
`;

type SongPlayerProps = {
  createdProgressions: Array<ProgressionDetails>;
  playingProgressionIndex: number;
  tempo: number;
  songTitle: string;
  songSynths?: SongSynths;
  generateNewProgression: (synths: SongSynths) => void;
  lyrics: Array<LyricLine>;
  currentWord: number;
};

export const SongPlayer = (songPlayerProps: SongPlayerProps) => {
  const {
    createdProgressions,
    playingProgressionIndex,
    tempo,
    songTitle,
    generateNewProgression,
    songSynths,
    lyrics,
    currentWord,
  } = songPlayerProps;

  return (
    <SongPlayerContainer>
      <SongDetailsContainer>
        <SongInfo
          progressions={createdProgressions}
          playingIndex={playingProgressionIndex}
          tempo={tempo}
          addNewChordCallback={() => {
            generateNewProgression(songSynths!);
          }}
        />
        <Sequencer
          tracks={createdProgressions[playingProgressionIndex].tracks}
        />
      </SongDetailsContainer>
      <LyricsContainer>
        <Lyrics
          lyrics={lyrics}
          songTitle={songTitle}
          currentWord={currentWord}
        />
      </LyricsContainer>
    </SongPlayerContainer>
  );
};
