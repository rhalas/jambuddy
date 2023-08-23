import { useState, useEffect, useCallback } from "react";
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
import {
  TrackData,
  ProgressionDetails,
  SongSynths,
} from "../helpers/types/types";
import {
  MAX_TEMPO,
  MIN_TEMPO,
  notes,
  progressions,
} from "../helpers/types/music_types";
import { makeTrackLoop } from "../helpers/music/sounds";
import {
  createSongTracks,
  generateScaleNotes,
  generatedRandomProgression,
  generateChordDetails,
} from "../helpers/music/music";
import { Sequencer } from "./sequencer";
import { SongInfo } from "./songInfo";
import { Button, Text } from "@radix-ui/themes";

function App() {
  const [songSynths, setSongSynths] = useState<SongSynths>();
  const [createdProgressions, setCreatedProgressions] = useState<
    Array<ProgressionDetails>
  >([]);
  const [playingProgressionIndex, setPlayingProgressionIndex] =
    useState<number>(0);
  const [ranCheckThisBar, setRanCheckThisBar] = useState<boolean>(false);
  const [tempo, setTempo] = useState<number>(-1);
  const [loops, setLoops] = useState<Array<Tone.Loop>>([]);
  const [beatNumber, setBeatNumber] = useState<number>(-1);

  const [loopOnDeck, setLoopOnDeck] = useState<boolean>(false);

  const prepareNextLoop = useCallback(
    (newTracks: Array<TrackData>) => {
      const newLoops: Array<Tone.Loop> = [];
      newTracks.forEach((track) => {
        if (track.synth) {
          newLoops.push(makeTrackLoop(track.synth, track.beats));
        }
      });

      loops.forEach((loop) => {
        loop.stop();
      });
      setLoops(newLoops);
    },
    [loops]
  );

  useEffect(() => {
    if (beatNumber % 16 == 0) {
      if (
        !ranCheckThisBar &&
        playingProgressionIndex < createdProgressions.length - 1
      ) {
        prepareNextLoop(
          createdProgressions[playingProgressionIndex + 1].tracks
        );
        setPlayingProgressionIndex((s) => s + 1);
        setRanCheckThisBar(true);
      }
    } else {
      setRanCheckThisBar(false);
      setLoopOnDeck(false);
    }
  }, [
    beatNumber,
    createdProgressions,
    playingProgressionIndex,
    ranCheckThisBar,
    prepareNextLoop,
    tempo,
    loopOnDeck,
  ]);

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
    await generateNewProgression(newSongSynths);
  };

  const generateNewProgression = async (synths: SongSynths) => {
    const rootNote = notes[Math.floor(Math.random() * notes.length)];
    const listOfModes = Object.keys(progressions);
    const newMode = listOfModes[Math.floor(Math.random() * listOfModes.length)];

    const newProgressionDetail: ProgressionDetails = {
      rootNote: rootNote,
      mode: newMode,
      progression: [],
      scale: [],
      tracks: [],
    };

    const scale = generateScaleNotes(newProgressionDetail);
    const chordDetails = generateChordDetails(scale, newProgressionDetail.mode);
    const progression = generatedRandomProgression(chordDetails);

    newProgressionDetail.progression = progression;
    newProgressionDetail.scale = scale;

    const newSongInfo = await createSongTracks(newProgressionDetail, synths);

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

    newProgressionDetail.tracks = newTracks;

    let tempoToUse = tempo;
    if (tempoToUse === -1) {
      tempoToUse =
        Math.floor(Math.random() * (MAX_TEMPO - MIN_TEMPO + 1)) + MIN_TEMPO;
    }

    if (!loopOnDeck) {
      prepareNextLoop(newTracks);
      setLoopOnDeck(true);
    }

    if (Tone.Transport.state === "stopped") {
      Tone.Transport.bpm.value = tempoToUse;
      Tone.Transport.start();
    }

    setCreatedProgressions((s) => [...s, newProgressionDetail]);
    setTempo(tempoToUse);
  };

  return (
    <div>
      {createdProgressions.length === 0 ? (
        <Button size="4" variant="classic" onClick={initAudio}>
          <Text>Play a song</Text>
        </Button>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default App;
