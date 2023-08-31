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
  makeVocalSynth,
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
import { WebMidi, Output } from "webmidi";
import { SongPrompt } from "../components/SongPrompt";
import { SongPlayer } from "../components/SongPlayer";
import { LyricLine } from "../helpers/api/api";

function App() {
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

  const [webMidiOutput, setWebMidiOut] = useState<Output | undefined>();
  const [currentWord, setCurrentWord] = useState<number>(0);
  const [promptDone, setPromptDone] = useState<boolean>(false);

  const [insturmentLoops, setInstrumentLoops] = useState<Array<Tone.Loop>>([]);

  const prepareNextLoop = useCallback(
    (newTracks: Array<TrackData>) => {
      const newLoops: Array<Tone.Loop> = [];
      newTracks.forEach((track, index) => {
        if (track.synth) {
          newLoops.push(
            makeTrackLoop(
              track.synth,
              track.beats,
              webMidiOutput,
              index + 1,
              track.name,
              setCurrentWord,
              lyrics
            )
          );
        }
      });

      insturmentLoops.forEach((insturmentLoop) => {
        insturmentLoop.stop();
      });
      setInstrumentLoops(newLoops);
    },
    [lyrics, insturmentLoops, webMidiOutput]
  );

  useEffect(() => {
    if (beatNumber % 16 == 0 && lyrics.length !== 0) {
      if (!ranCheckThisBar) {
        let nextLyricIndex = currentLyricIndex + 1;
        if (nextLyricIndex === lyrics.length) {
          nextLyricIndex = 0;
        }

        if (playingProgressionIndex < createdProgressions.length - 1) {
          nextLyricIndex = 0;
          setCurrentWord(0);
          console.log(lyrics);
          prepareNextLoop(
            createdProgressions[playingProgressionIndex + 1].tracks
          );
          setPlayingProgressionIndex((s) => s + 1);
        }

        setCurrentLyricIndex(nextLyricIndex);
        setRanCheckThisBar(true);
      }
    } else {
      setRanCheckThisBar(false);
      setLoopOnDeck(false);
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

  const onEnabled = async () => {
    if (WebMidi.outputs.length >= 1) {
      const output = WebMidi.outputs[1];
      setWebMidiOut(output);
    }
  };

  const generateNewProgression = useCallback(
    async (synths: SongSynths) => {
      const newProgressionDetail: ProgressionDetails = {
        rootNote: "",
        mode: "",
        progression: [],
        scale: [],
        tracks: [],
      };

      const rootNote = notes[Math.floor(Math.random() * notes.length)];
      const listOfModes = Object.keys(progressions);
      const newMode =
        listOfModes[Math.floor(Math.random() * listOfModes.length)];

      newProgressionDetail.rootNote = rootNote;
      newProgressionDetail.mode = newMode;

      const scale = generateScaleNotes(newProgressionDetail);
      const chordDetails = generateChordDetails(
        scale,
        newProgressionDetail.mode
      );
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
        newSongInfo.vocalTrack,
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
    },
    [loopOnDeck, prepareNextLoop, tempo]
  );

  useEffect(() => {
    if (promptDone) {
      WebMidi.enable()
        .then(onEnabled)
        .catch((err) => alert(err));

      const newSongSynths: SongSynths = {
        rhythm: makeRhythmSynth(),
        lead: makeLeadSynth(),
        vocal: makeVocalSynth(),
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
      generateNewProgression(newSongSynths);
      setPromptDone(false);
    }
  }, [promptDone, generateNewProgression]);

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
          generateNewProgression={generateNewProgression}
          lyrics={lyrics}
          currentWord={currentWord}
        />
      )}
    </div>
  );
}

export default App;
