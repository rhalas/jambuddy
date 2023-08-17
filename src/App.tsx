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
import { ChordInfo, NUMBER_OF_BEATS, TrackData, KeyInfo } from "./types";
import { makeTrackLoop } from "./sounds";
import { makeRandomProgression, notes, progressions } from "./music";
import { Sequencer } from "./sequencer";
import { makeNewTrack } from "./utils";

function App() {
  const [rhythmSynth, setRhythmSynth] = useState<Tone.PolySynth>();
  const [leadSynth, setLeadSynth] = useState<Tone.PolySynth>();
  const [snareDrum, setSnareDrum] = useState<Tone.NoiseSynth>();
  const [bassDrum, setBassDrum] = useState<Tone.MembraneSynth>();
  const [bassSynth, setBassSynth] = useState<Tone.PolySynth>();
  const [progression, setProgression] = useState<Array<ChordInfo>>([]);
  const [songReady, setSongReady] = useState<boolean>(false);

  const [beatNumber, setBeatNumber] = useState<number>(-1);
  const [tracks, setTracks] = useState<Array<TrackData>>([]);
  const [songKey, setSongKey] = useState<KeyInfo | undefined>();

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
    if (readyToGenerateProgression && songKey) {
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
          songInfo.melodyTrack,
          songInfo.bassTrack,
          songInfo.bassDrumTrack,
          songInfo.snareDrumTrack,
        ];

        setTracks(newTracks);
        setProgression(songInfo.progression);
        setSongReady(true);
      };

      getSongInfo();
    }
  }, [readyToGenerateProgression, songKey]);

  const generateNewProgression = () => {
    const rootNote = notes[Math.floor(Math.random() * notes.length)];
    const listOfProgressions = Object.keys(progressions);
    const newProgression =
      listOfProgressions[Math.floor(Math.random() * listOfProgressions.length)];
    const newSongKey = {
      rootNote: rootNote,
      progression: newProgression,
    };
    setSongKey(newSongKey);
    setCreateAudioContexts(true);
  };

  useEffect(() => {
    if (songReady) {
      tracks.forEach((track) => {
        if (track.synth) {
          makeTrackLoop(track.synth, track.beats);
        }
      });
      Tone.Transport.start();
    }
  }, [songReady, tracks]);

  return (
    <>
      <div>
        {tracks.length === 0 ? (
          <button onClick={generateNewProgression}>Play a song</button>
        ) : (
          <>
            <div>
              <div>
                Key: {songKey?.rootNote} {songKey?.progression}
              </div>
              <div>
                Chord Progression:{" "}
                {progression &&
                  progression.map((p: ChordInfo) => p.position).join(" - ")}
              </div>
            </div>
          </>
        )}
      </div>
      <Sequencer tracks={tracks} currentBeat={beatNumber} />
    </>
  );
}

export default App;
