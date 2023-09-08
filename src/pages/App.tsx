import { useState, useEffect, useCallback } from "react";
import "./App.css";
import * as Tone from "tone";
import { makeNewSongSynths } from "../helpers/music/synths";
import {
  TrackData,
  ProgressionDetails,
  SongSynths,
} from "../helpers/types/types";
import { makeTrackLoop } from "../helpers/music/sounds";
import { generateNewProgression, prepareTempo } from "../helpers/music/music";
import { createSongTracks } from "../helpers/music/tracks";
import { SongPrompt } from "../components/SongPrompt";
import { SongPlayer } from "../components/SongPlayer";
import { LyricLine } from "../helpers/api/api";
import { useMIDI } from "../hooks/useMidi";
import { scheduleBeatIncrement } from "../helpers/music/schedule";

function App() {
  const { midiOutputs } = useMIDI();

  const [songSynths, setSongSynths] = useState<SongSynths>();
  const [createdProgressions, setCreatedProgressions] = useState<
    Array<ProgressionDetails>
  >([]);
  const [playingProgressionIndex, setPlayingProgressionIndex] =
    useState<number>(0);
  const [ranCheckThisBar, setRanCheckThisBar] = useState<boolean>(false);
  const [tempo, setTempo] = useState<number>(-1);
  const [beatNumber, setBeatNumber] = useState<number>(-1);
  const [songTitle, setSongTitle] = useState<string>("");

  const [lyrics, setLyrics] = useState<Array<LyricLine>>([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(0);

  const [loopOnDeck, setLoopOnDeck] = useState<boolean>(false);

  const [currentWord, setCurrentWord] = useState<number>(0);
  const [promptDone, setPromptDone] = useState<boolean>(false);

  const [insturmentLoops, setInstrumentLoops] = useState<Array<Tone.Loop>>([]);

  const prepareNextLoop = useCallback(
    (newTracks: Array<TrackData>) => {
      const newLoops: Array<Tone.Loop> = newTracks.map((track, index) => {
        return makeTrackLoop(
          track,
          midiOutputs[1],
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
    [lyrics, insturmentLoops, midiOutputs]
  );

  useEffect(() => {
    if (beatNumber % 16 == 0) {
      if (!ranCheckThisBar) {
        let nextLyricIndex = currentLyricIndex + 1;
        if (nextLyricIndex === lyrics.length) {
          nextLyricIndex = 0;
        }

        if (playingProgressionIndex < createdProgressions.length - 1) {
          nextLyricIndex = 0;
          setCurrentWord(0);
          prepareNextLoop(
            createdProgressions[playingProgressionIndex + 1].tracks
          );
          setPlayingProgressionIndex((s) => s + 1);
          setLoopOnDeck(true);
        } else {
          setLoopOnDeck(false);
        }

        setCurrentLyricIndex(nextLyricIndex);
        setRanCheckThisBar(true);
      }
    } else {
      setRanCheckThisBar(false);
    }
  }, [
    ranCheckThisBar,
    beatNumber,
    createdProgressions,
    playingProgressionIndex,
    prepareNextLoop,
    tempo,
    loopOnDeck,
    currentLyricIndex,
    lyrics,
    setCurrentLyricIndex,
    currentWord,
  ]);

  const makeNewSong = useCallback(
    async (synths: SongSynths) => {
      const newProgressionDetail = generateNewProgression();

      const newSongInfo = await createSongTracks(newProgressionDetail, synths);

      newProgressionDetail.tracks = Object.values(newSongInfo);

      prepareTempo(tempo, setTempo);

      if (!loopOnDeck) {
        prepareNextLoop(newProgressionDetail.tracks);
        setLoopOnDeck(true);
      }

      setCreatedProgressions((s) => [...s, newProgressionDetail]);
    },
    [loopOnDeck, prepareNextLoop, tempo]
  );

  useEffect(() => {
    if (promptDone) {
      const newSongSynths = makeNewSongSynths();
      scheduleBeatIncrement(setBeatNumber);
      setSongSynths(newSongSynths);
      makeNewSong(newSongSynths);
      setPromptDone(false);
    }
  }, [promptDone, makeNewSong]);

  const deleteProgression = useCallback(
    (idx: number) => {
      createdProgressions.splice(idx, 1);
      if (playingProgressionIndex + 1 < createdProgressions.length) {
        prepareNextLoop(
          createdProgressions[playingProgressionIndex + 1].tracks
        );
      } else {
        prepareNextLoop(createdProgressions[playingProgressionIndex].tracks);
      }
    },
    [createdProgressions, prepareNextLoop, playingProgressionIndex]
  );

  return (
    <div>
      {createdProgressions.length === 0 ? (
        <SongPrompt
          setPromptDone={setPromptDone}
          setSongTitle={setSongTitle}
          setLyrics={setLyrics}
        />
      ) : (
        <SongPlayer
          createdProgressions={createdProgressions}
          playingProgressionIndex={playingProgressionIndex}
          tempo={tempo}
          songTitle={songTitle}
          songSynths={songSynths}
          makeNewSong={makeNewSong}
          lyrics={lyrics}
          currentWord={currentWord}
          midiOutputs={midiOutputs}
          deleteProgressionCallback={deleteProgression}
        />
      )}
    </div>
  );
}

export default App;
