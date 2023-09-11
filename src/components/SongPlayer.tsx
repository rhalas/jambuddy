import styled from "styled-components";
import { SongInfo } from "./SongInfo";
import { Sequencer } from "./Sequencer";
import { ProgressionDetails, NewLoopType } from "../helpers/types/types";
import { Lyrics } from "./Lyrics";
import { LyricLine } from "../helpers/api/api";
import { Output } from "webmidi";
import { useState } from "react";
import { VolumeSlider } from "./VolumeSlider";
import { Dispatch, SetStateAction } from "react";

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
  addNewLoopCallback: (newLoopType: NewLoopType) => void;
  lyrics: Array<LyricLine>;
  currentWord: number;
  midiOutputs: Array<Output>;
  deleteProgressionCallback: (idx: number) => void;
  queueProgressionCallback: (idx: number) => void;
  loopOnDeck: number;
  setVolumeLevel: Dispatch<SetStateAction<number>>;
  volumeLevel: number;
  currentChordPosition: number;
};

export const SongPlayer = (songPlayerProps: SongPlayerProps) => {
  const [showNotation, setShowNotation] = useState(false);

  const {
    createdProgressions,
    playingProgressionIndex,
    tempo,
    songTitle,
    addNewLoopCallback,
    lyrics,
    currentWord,
    midiOutputs,
    deleteProgressionCallback,
    loopOnDeck,
    queueProgressionCallback,
    setVolumeLevel,
    volumeLevel,
    currentChordPosition,
  } = songPlayerProps;

  return (
    <>
      <VolumeSlider volumeLevel={volumeLevel} setVolumeLevel={setVolumeLevel} />
      <SongPlayerContainer>
        <SongDetailsContainer>
          <SongInfo
            progressions={createdProgressions}
            playingIndex={playingProgressionIndex}
            tempo={tempo}
            addNewLoopCallback={addNewLoopCallback}
            midiOutputs={midiOutputs}
            showNotation={showNotation}
            setShowNotation={setShowNotation}
            deleteProgressionCallback={deleteProgressionCallback}
            loopOnDeck={loopOnDeck}
            queueProgressionCallback={queueProgressionCallback}
            currentChordPosition={currentChordPosition}
          />
          <Sequencer
            tracks={createdProgressions[playingProgressionIndex].tracks}
            showNotation={showNotation}
          />
        </SongDetailsContainer>
        <Lyrics
          lyrics={lyrics}
          songTitle={songTitle}
          currentWord={currentWord}
        />
      </SongPlayerContainer>
    </>
  );
};
