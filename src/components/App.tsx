import { useState, useEffect } from "react";
import "./App.css";
import * as Tone from "tone";
import {
  makeSnareDrum,
  makeBassDrum,
  makeLeadSynth,
  makeRhythmSynth,
  makeBassSynth,
  makeClosedHiHat,
  makeOpenHiHat,
} from "../helpers/music/synths";
import { TrackData, ProgressionInfo, SongSynths } from "../helpers/types/types";
import {
  MAX_TEMPO,
  MIN_TEMPO,
  notes,
  progressions,
} from "../helpers/types/music_types";
import { makeTrackLoop } from "../helpers/music/sounds";
import { createSongTracks } from "../helpers/music/music";
import { Sequencer } from "./sequencer";
import { SongInfo } from "./song_info";
import { Button, Text } from "@radix-ui/themes";

function App() {
  const [songSynths, setSongSynths] = useState<SongSynths>();

  const [progressionInfo, setProgressionInfo] = useState<
    Array<ProgressionInfo>
  >([]);
  const [processingProgressionIndex, setProcessingProgressionIndex] =
    useState<number>(-1);

  const [playingProgressionIndex, setPlayingProgressionIndex] =
    useState<number>(0);

  const [initNew, setInitNew] = useState<boolean>(true);

  const [tempo, setTempo] = useState<number>(-1);
  const [loops, setLoops] = useState<Array<Tone.Loop>>();

  const [tracks, setTracks] = useState<Array<TrackData>>([]);
  const [beatNumber, setBeatNumber] = useState<number>(-1);

  const initAudio = async () => {
    const newSongSynths: SongSynths = {
      rhythm: makeRhythmSynth(),
      lead: makeLeadSynth(),
      snareDrum: makeSnareDrum(),
      bassDrum: makeBassDrum(),
      bass: makeBassSynth(),
      closedHiHat: makeClosedHiHat(),
      openHiHat: makeOpenHiHat(),
    };

    Tone.Transport.scheduleRepeat(() => {
      setBeatNumber((beatNumber) => beatNumber + 1);
    }, `4n`);

    setSongSynths(newSongSynths);
    await generateNewProgression();
  };

  const generateNewProgression = async () => {
    const rootNote = notes[Math.floor(Math.random() * notes.length)];
    const listOfModes = Object.keys(progressions);
    const newMode = listOfModes[Math.floor(Math.random() * listOfModes.length)];

    const newProgressionInfo = {
      rootNote: rootNote,
      mode: newMode,
      progression: [],
    };

    setProgressionInfo((s) => [...s, newProgressionInfo]);
    setProcessingProgressionIndex((p) => p + 1);
  };

  useEffect(() => {
    if (
      beatNumber % 16 == 0 &&
      playingProgressionIndex < progressionInfo.length - 1
    ) {
      setPlayingProgressionIndex((s) => s + 1);
    }
  }, [beatNumber, progressionInfo, playingProgressionIndex]);

  useEffect(() => {
    if (
      progressionInfo.length > 0 &&
      processingProgressionIndex >= 0 &&
      initNew
    ) {
      const processingProgression = progressionInfo[processingProgressionIndex];

      const getSongInfo = async () => {
        const newSongInfo = await createSongTracks(
          processingProgression,
          songSynths!
        );

        const newTracks = [
          newSongInfo.rhythmTrack,
          newSongInfo.melodyTrack,
          newSongInfo.bassTrack,
          newSongInfo.guitarRhythmTrack,
          newSongInfo.bassDrumTrack,
          newSongInfo.snareDrumTrack,
          newSongInfo.openHiHatTrack,
          newSongInfo.closedHiHatTrack,
        ];

        let tempoToUse = tempo;
        if (tempoToUse === -1) {
          tempoToUse =
            Math.floor(Math.random() * (MAX_TEMPO - MIN_TEMPO + 1)) + MIN_TEMPO;
        }

        const newLoops: Array<Tone.Loop> = [];
        newTracks.forEach((track) => {
          if (track.synth) {
            newLoops.push(makeTrackLoop(track.synth, track.beats));
          }
        });

        if (loops && loops.length > 0) {
          loops.forEach((loop) => {
            loop.stop();
          });
        }

        Tone.Transport.bpm.value = tempoToUse;
        Tone.Transport.start();

        setTempo(tempoToUse);
        setTracks(newTracks);
        setLoops(newLoops);
        setInitNew(false);

        const updatedProgression = [...progressionInfo];
        updatedProgression[processingProgressionIndex].progression =
          newSongInfo.progression;
        setProgressionInfo(updatedProgression);
      };

      getSongInfo();
    }
  }, [
    songSynths,
    progressionInfo,
    processingProgressionIndex,
    tracks,
    initNew,
    loops,
    tempo,
  ]);

  return (
    <>
      <div>
        {tracks.length === 0 ? (
          <Button size="4" variant="classic" onClick={initAudio}>
            <Text>Play a song</Text>
          </Button>
        ) : (
          <>
            <SongInfo
              songKey={
                playingProgressionIndex <= progressionInfo.length
                  ? progressionInfo[playingProgressionIndex]
                  : undefined
              }
              tracks={tracks}
              tempo={tempo}
              addNewChordCallback={() => {
                setInitNew(true);
                generateNewProgression();
              }}
            />
            <Sequencer tracks={tracks} />
          </>
        )}
      </div>
    </>
  );
}

export default App;
