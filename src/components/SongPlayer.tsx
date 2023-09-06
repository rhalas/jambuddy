import styled from "styled-components";
import { SongInfo } from "./SongInfo";
import { Sequencer } from "./Sequencer";
import { ProgressionDetails, SongSynths } from "../helpers/types/types";
import { Lyrics } from "./Lyrics";
import { LyricLine } from "../helpers/api/api";
import { Output } from "webmidi";
import { useState } from "react";

const SongPlayerContainer = styled.div`
  display: flex;
`;

const SongDetailsContainer = styled.div`
  flex: 1;
  width: 100%;
`;

type SongPlayerProps = {
  createdProgressions: Array<ProgressionDetails>;
  playingProgressionIndex: number;
  tempo: number;
  songTitle: string;
  songSynths?: SongSynths;
  makeNewSong: (synths: SongSynths) => void;
  lyrics: Array<LyricLine>;
  currentWord: number;
  midiOutputs: Array<Output>;
};

export const SongPlayer = (songPlayerProps: SongPlayerProps) => {
  const [showNotation, setShowNotation] = useState(false);

  const {
    createdProgressions,
    playingProgressionIndex,
    tempo,
    songTitle,
    makeNewSong,
    songSynths,
    lyrics,
    currentWord,
    midiOutputs,
  } = songPlayerProps;

  return (
    <SongPlayerContainer>
      <SongDetailsContainer>
        <SongInfo
          progressions={createdProgressions}
          playingIndex={playingProgressionIndex}
          tempo={tempo}
          addNewChordCallback={() => {
            makeNewSong(songSynths!);
          }}
          midiOutputs={midiOutputs}
          showNotation={showNotation}
          setShowNotation={setShowNotation}
        />
        <Sequencer
          tracks={createdProgressions[playingProgressionIndex].tracks}
          showNotation={showNotation}
        />
      </SongDetailsContainer>
      <Lyrics lyrics={lyrics} songTitle={songTitle} currentWord={currentWord} />
    </SongPlayerContainer>
  );
};
