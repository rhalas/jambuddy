import { useState, useEffect, useCallback } from "react";
import "./App.css";
import * as Tone from "tone";
import { makeNewSongSynths } from "../helpers/music/synths";
import { ProgressionDetails, SongSynths } from "../helpers/types/types";
import { makeTrackLoop } from "../helpers/music/sounds";
import { generateNewProgression, prepareTempo } from "../helpers/music/music";
import { createSongTracks } from "../helpers/music/tracks";
import { SongPrompt } from "../components/SongPrompt";
import { SongPlayer } from "../components/SongPlayer";
import { LyricLine } from "../helpers/api/api";
import { useMIDI } from "../hooks/useMidi";
import { scheduleBeatIncrement } from "../helpers/music/schedule";
import { NewLoopType } from "../helpers/types/types";

function App() {
  const { midiOutputs } = useMIDI();

  const [songSynths, setSongSynths] = useState<SongSynths>();
  const [createdProgressions, setCreatedProgressions] = useState<
    Array<ProgressionDetails>
  >([]);
  const [playingProgressionIndex, setPlayingProgressionIndex] =
    useState<number>(0);
  const [ranCheckThisLoop, setRanCheckThisLoop] = useState<boolean>(false);
  const [tempo, setTempo] = useState<number>(-1);
  const [beatNumber, setBeatNumber] = useState<number>(-1);
  const [songTitle, setSongTitle] = useState<string>("");

  const [lyrics, setLyrics] = useState<Array<LyricLine>>([]);

  const [nextProgressionIndex, setNextProgressionIndex] = useState<number>(0);

  const [firstSongInitDone, setFirstSongInitDone] = useState<boolean>(false);

  const [currentWord, setCurrentWord] = useState<number>(0);
  const [promptDone, setPromptDone] = useState<boolean>(false);

  const [insturmentLoops, setInstrumentLoops] = useState<Array<Tone.Loop>>([]);
  const [volumeLevel, setVolumeLevel] = useState<number>(-10);
  const [currentChordPosition, setCurrentChordPosition] = useState<number>(0);
  const [editModeIndex, setEditModeIndex] = useState<number>(-1);
  const [activeMidiDevice, setActiveMidiDevice] = useState<number>(0);

  useEffect(() => {
    if (createdProgressions.length === 0) {
      setNextProgressionIndex(0);
    } else if (createdProgressions.length === 2) {
      setNextProgressionIndex(1);
    }
  }, [createdProgressions]);

  const prepareNextLoop = useCallback(
    (progressionNum: number) => {
      if (createdProgressions.length === 0) {
        return;
      }
      const newTracks = createdProgressions[progressionNum].tracks;
      const newLoops: Array<Tone.Loop> = newTracks.map((track, index) => {
        return makeTrackLoop(
          track,
          midiOutputs[activeMidiDevice],
          index + 1,
          setCurrentWord,
          lyrics
        );
      });

      insturmentLoops.forEach((insturmentLoop) => {
        insturmentLoop.stop();
      });
      setInstrumentLoops(newLoops);
    },
    [
      lyrics,
      insturmentLoops,
      midiOutputs,
      createdProgressions,
      activeMidiDevice,
    ]
  );

  useEffect(() => {
    prepareNextLoop(nextProgressionIndex);
  }, [nextProgressionIndex, createdProgressions]);

  const makeNewSong = useCallback(
    async (
      newLoopType: NewLoopType,
      progressionUpdateIndex?: number,
      newMode?: string,
      newRoot?: string
    ) => {
      if (songSynths) {
        if (newLoopType === "random_key") {
          const newProgressionDetail = generateNewProgression();
          const newSongInfo = await createSongTracks(
            newProgressionDetail,
            songSynths
          );
          newProgressionDetail.tracks = Object.values(newSongInfo);
          setCreatedProgressions((s) => [...s, newProgressionDetail]);
        } else if (newLoopType === "same_key") {
          const currProgression = createdProgressions[playingProgressionIndex];
          const newProgressionDetail = generateNewProgression(
            currProgression.rootNote,
            currProgression.mode
          );
          const newSongInfo = await createSongTracks(
            newProgressionDetail,
            songSynths
          );
          newProgressionDetail.tracks = Object.values(newSongInfo);
          setCreatedProgressions((s) => [...s, newProgressionDetail]);
        } else if (newLoopType === "clone_current") {
          const newProgressionDetail =
            createdProgressions[playingProgressionIndex];
          setCreatedProgressions((s) => [...s, newProgressionDetail]);
        } else if (newLoopType === "update_existing") {
          if (
            progressionUpdateIndex !== undefined &&
            progressionUpdateIndex >= 0 &&
            (newMode !== undefined || newRoot !== undefined)
          ) {
            const currProgression = createdProgressions[progressionUpdateIndex];

            const updatedRoot =
              newRoot !== undefined ? newRoot : currProgression.rootNote;
            const updatedMode =
              newMode !== undefined ? newMode : currProgression.mode;

            const newProgressionDetail = generateNewProgression(
              updatedRoot,
              updatedMode
            );

            const newSongInfo = await createSongTracks(
              newProgressionDetail,
              songSynths
            );
            newProgressionDetail.tracks = Object.values(newSongInfo);

            const updatedProgressions = [...createdProgressions];
            updatedProgressions[progressionUpdateIndex] = newProgressionDetail;
            setCreatedProgressions(updatedProgressions);
          }
        }
      }
    },
    [songSynths, createdProgressions, playingProgressionIndex]
  );

  const deleteProgression = useCallback(
    (idx: number) => {
      createdProgressions.splice(idx, 1);
      if (playingProgressionIndex + 1 < createdProgressions.length) {
        prepareNextLoop(-1);
      } else {
        prepareNextLoop(-1);
      }
    },
    [createdProgressions, prepareNextLoop, playingProgressionIndex]
  );

  const queueProgression = useCallback(
    (idx: number) => {
      prepareNextLoop(idx);
      setNextProgressionIndex(idx);
    },
    [prepareNextLoop]
  );

  useEffect(() => {
    if (createdProgressions.length >= 1) {
      if (beatNumber % 4 == 0) {
        setCurrentChordPosition(Math.floor(beatNumber / 4) % 4);
      }

      if (beatNumber % 16 == 0 && editModeIndex === -1) {
        if (!ranCheckThisLoop) {
          setPlayingProgressionIndex(nextProgressionIndex);

          if (nextProgressionIndex === createdProgressions.length - 1) {
            setNextProgressionIndex(0);
          } else {
            setNextProgressionIndex((s) => s + 1);
          }

          setRanCheckThisLoop(true);
        }
      } else {
        setRanCheckThisLoop(false);
      }
    }
  }, [
    ranCheckThisLoop,
    beatNumber,
    createdProgressions,
    prepareNextLoop,
    currentWord,
    nextProgressionIndex,
    editModeIndex,
  ]);

  useEffect(() => {
    if (promptDone) {
      const newSongSynths = makeNewSongSynths(volumeLevel);
      setSongSynths(newSongSynths);
      setPromptDone(false);
    }
  }, [promptDone, volumeLevel]);

  useEffect(() => {
    if (songSynths) {
      songSynths.masterVol.volume.value = volumeLevel;
    }
  }, [volumeLevel, songSynths]);

  useEffect(() => {
    if (songSynths && !firstSongInitDone) {
      const initFirstSong = async () => {
        setFirstSongInitDone(true);
        await makeNewSong("random_key");

        setPlayingProgressionIndex(0);
        prepareTempo(tempo, setTempo);
        scheduleBeatIncrement(setBeatNumber);
      };
      initFirstSong();
    }
  }, [
    songSynths,
    makeNewSong,
    tempo,
    firstSongInitDone,
    createdProgressions,
    prepareNextLoop,
  ]);

  return (
    <div>
      {createdProgressions.length === 0 ? (
        <SongPrompt
          setPromptDone={setPromptDone}
          setSongTitle={setSongTitle}
          setLyrics={setLyrics}
        />
      ) : (
        <>
          <SongPlayer
            createdProgressions={createdProgressions}
            playingProgressionIndex={playingProgressionIndex}
            tempo={tempo}
            songTitle={songTitle}
            addNewLoopCallback={makeNewSong}
            lyrics={lyrics}
            currentWord={currentWord}
            midiOutputs={midiOutputs}
            deleteProgressionCallback={deleteProgression}
            queueProgressionCallback={queueProgression}
            loopOnDeck={nextProgressionIndex}
            setVolumeLevel={setVolumeLevel}
            volumeLevel={volumeLevel}
            currentChordPosition={currentChordPosition}
            editModeIndex={editModeIndex}
            setEditModeIndex={setEditModeIndex}
            setActiveMidiDevice={setActiveMidiDevice}
            activeMidiDevice={activeMidiDevice}
          />
        </>
      )}
    </div>
  );
}

export default App;
