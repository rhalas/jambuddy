import { useState, useEffect } from "react";
import "./App.css";
import * as Tone from "tone";
import {
  makeSnareDrum,
  makeBassDrum,
  makeLeadSynth,
  makeRhythmSynth,
} from "./synths";
import { MelodyPiece } from "./types";
import { chords } from "./music";
import {
  makeSnareLoop,
  makeBassDrumLoop,
  makeRhythmLoop,
  makeMelodyLoop,
} from "./sounds";
import { makeRandomProgression } from "./music";

function App() {
  const [rhythmSynth, setRhythmSynth] = useState<Tone.PolySynth>();
  const [leadSynth, setLeadSynth] = useState<Tone.PolySynth>();
  const [snare, setSnare] = useState<Tone.NoiseSynth>();
  const [bass, setBass] = useState<Tone.MembraneSynth>();

  const [progression, setProgression] = useState<Array<string>>([]);
  const [melody, setMelody] = useState<Array<MelodyPiece>>([]);

  useEffect(() => {
    setRhythmSynth(makeRhythmSynth());
    setLeadSynth(makeLeadSynth());
    setSnare(makeSnareDrum());
    setBass(makeBassDrum());
  }, []);

  const generateNewProgression = () => {
    const songInfo = makeRandomProgression();
    setProgression(songInfo.chordProgression);
    setMelody(songInfo.melody);
  };

  const playProgression = () => {
    const chordProgression: Array<Array<string>> = [];
    progression?.map((chord: string) => {
      const chordNotes = chords[chord];
      chordProgression.push(chordNotes);
    });

    makeRhythmLoop(rhythmSynth!, chordProgression);
    makeMelodyLoop(leadSynth!, melody);
    makeBassDrumLoop(bass!);
    makeSnareLoop(snare!);

    Tone.Transport.start();
  };

  return (
    <>
      <div>
        <div>
          {progression && progression.map((chord) => chord).join(" - ")}
        </div>
        <div>{melody && melody.map((note) => note.note).join(" - ")}</div>
        <button onClick={generateNewProgression}>Make Progression</button>
        <button onClick={playProgression}>Play Progression</button>
      </div>
    </>
  );
}

export default App;
