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
} from "./synths";
import { ChordInfo, TrackData, KeyInfo, SongSynths } from "./types";
import { makeTrackLoop } from "./sounds";
import { makeRandomProgression, notes, progressions } from "./music";
import { Sequencer } from "./sequencer";

function App() {
  const [songSynths, setSongSynths] = useState<SongSynths>();

  const [progression, setProgression] = useState<Array<ChordInfo>>([]);
  const [songReady, setSongReady] = useState<boolean>(false);

  const [beatNumber, setBeatNumber] = useState<number>(-1);
  const [tempo, setTempo] = useState<number>(120);
  const [tracks, setTracks] = useState<Array<TrackData>>([]);
  const [songKey, setSongKey] = useState<KeyInfo | undefined>();

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
        closedHiHat: makeClosedHiHat(),
        openHiHat: makeOpenHiHat(),
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

        const newTracks = [
          songInfo.rhythmTrack,
          songInfo.melodyTrack,
          songInfo.bassTrack,
          //songInfo.guitarRhythmTrack,
          songInfo.bassDrumTrack,
          songInfo.snareDrumTrack,
          songInfo.openHiHatTrack,
          songInfo.closedHiHatTrack,
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
      setTempo(newTempo);
      const newLoops: Array<Tone.Loop> = [];
      tracks.forEach((track) => {
        if (track.synth) {
          newLoops.push(makeTrackLoop(track.synth, track.beats, newTempo));
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
