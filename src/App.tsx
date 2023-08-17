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
import { ChordInfo, TrackData, KeyInfo, SongSynths } from "./types";
import { makeTrackLoop } from "./sounds";
import { makeRandomProgression, notes, progressions } from "./music";
import { Sequencer } from "./sequencer";
import { makeNewTrack } from "./utils";

function App() {
  const [songSynths, setSongSynths] = useState<SongSynths>();

  const [progression, setProgression] = useState<Array<ChordInfo>>([]);
  const [songReady, setSongReady] = useState<boolean>(false);

  const [beatNumber, setBeatNumber] = useState<number>(-1);
  const [tracks, setTracks] = useState<Array<TrackData>>([]);
  const [songKey, setSongKey] = useState<KeyInfo | undefined>();
  const [activeLoops, setActiveLoops] = useState<Array<Tone.Loop>>([]);

  const [readyToGenerateProgression, setReadyToGenerateProgression] =
    useState<boolean>(false);
  const [createAudioContexts, setCreateAudioContexts] =
    useState<boolean>(false);

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
    if (createAudioContexts) {
      const newSongSynths: SongSynths = {
        rhythm: makeRhythmSynth(),
        lead: makeLeadSynth(),
        snareDrum: makeSnareDrum(),
        bassDrum: makeBassDrum(),
        bass: makeBassSynth(),
      };

      setSongSynths(newSongSynths);

      Tone.Transport.scheduleRepeat(() => {
        setBeatNumber((beatNumber) => beatNumber + 1);
      }, `4n`);

      setReadyToGenerateProgression(true);
    }
  }, [createAudioContexts]);

  useEffect(() => {
    if (readyToGenerateProgression && songKey && songSynths) {
      const getSongInfo = async () => {
        const songInfo = await makeRandomProgression(songKey, songSynths);
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
  }, [readyToGenerateProgression, songKey, songSynths]);

  useEffect(() => {
    if (songReady) {
      const newTempo = Math.floor(Math.random() * (160 - 80 + 1)) + 80;
      const newLoops: Array<Tone.Loop> = [];
      tracks.forEach((track) => {
        if (track.synth) {
          newLoops.push(makeTrackLoop(track.synth, track.beats, newTempo));
        }
      });
      setActiveLoops(newLoops);
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
