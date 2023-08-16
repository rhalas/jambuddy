import { useState, useEffect } from "react";
import "./App.css";
import * as Tone from "tone";
import {
  makeSnareDrum,
  makeBassDrum,
  makeLeadSynth,
  makeRhythmSynth,
  makeBassSynth,
} from "./synths";
import { NUMBER_OF_BEATS, TrackData } from "./types";
import { makeTrackLoop } from "./sounds";
import { makeRandomProgression, chordUrls } from "./music";
import { Sequencer } from "./sequencer";
import { makeNewTrack } from "./utils";

function App() {
  const [rhythmSynth, setRhythmSynth] = useState<Tone.PolySynth>();
  const [leadSynth, setLeadSynth] = useState<Tone.PolySynth>();
  const [snareDrum, setSnareDrum] = useState<Tone.NoiseSynth>();
  const [bassDrum, setBassDrum] = useState<Tone.MembraneSynth>();
  const [bassSynth, setBassSynth] = useState<Tone.PolySynth>();

  const [beatNumber, setBeatNumber] = useState<number>(-1);
  const [tracks, setTracks] = useState<Array<TrackData>>([]);
  const [songKey] = useState<string>("C");

  const [readyToGenerateProgression, setReadyToGenerateProgression] =
    useState<boolean>(false);
  const [createAudioContexts, setCreateAudioContexts] =
    useState<boolean>(false);

  useEffect(() => {
    if (createAudioContexts) {
      setRhythmSynth(makeRhythmSynth());
      setLeadSynth(makeLeadSynth());
      setSnareDrum(makeSnareDrum());
      setBassDrum(makeBassDrum());
      setBassSynth(makeBassSynth());

      Tone.Transport.scheduleRepeat(() => {
        setBeatNumber((beatNumber) => beatNumber + 1);
      }, `4n`);

      const beats = [];
      for (let i = 0; i < NUMBER_OF_BEATS; i++) {
        beats.push(i);
      }

      setReadyToGenerateProgression(true);
    }
  }, [createAudioContexts]);

  useEffect(() => {
    if (readyToGenerateProgression) {
      const getSongInfo = async () => {
        const songInfo = await makeRandomProgression(
          songKey,
          rhythmSynth!,
          leadSynth!,
          bassSynth!,
          bassDrum!,
          snareDrum!
        );
        const metronomeTrack = makeNewTrack("Beat");

        const newTracks = [
          metronomeTrack,
          songInfo.rhythmTrack,
          songInfo.guitarRhythmTrack,
          songInfo.melodyTrack,
          songInfo.bassTrack,
          songInfo.bassDrumTrack,
          songInfo.snareDrumTrack,
        ];

        setTracks(newTracks);
      };

      getSongInfo();
    }
  }, [readyToGenerateProgression]);

  const generateNewProgression = () => {
    setCreateAudioContexts(true);
  };

  const playProgression = async () => {
    tracks.forEach((track) => {
      if (track.synth) {
        makeTrackLoop(track.synth, track.beats);
      }
    });
    Tone.Transport.start();
  };

  return (
    <>
      <div>
        {tracks.length === 0 ? (
          <button onClick={generateNewProgression}>Make Progression</button>
        ) : (
          <>
            <div>Chord Progression: </div>
            <button onClick={playProgression}>Play Progression</button>
          </>
        )}
      </div>
      <Sequencer tracks={tracks} currentBeat={beatNumber} />
    </>
  );
}

export default App;
