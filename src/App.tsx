import { useState, useEffect } from "react";
import "./App.css";
import * as Tone from "tone";
import {
  makeSnareDrum,
  makeBassDrum,
  makeLeadSynth,
  makeRhythmSynth,
} from "./synths";
import { MelodyPiece, BeatInfo, NUMBER_OF_BEATS } from "./types";
import { chords } from "./music";
import {
  makeSnareLoop,
  makeBassDrumLoop,
  makeRhythmLoop,
  makeMelodyLoop,
  playBassDrumLoop,
  playSnareDrumLoop,
} from "./sounds";
import { makeRandomProgression } from "./music";
import styled from "styled-components";

const Beats = styled.div`
  display: flex;
`;

const Square = styled.div<{ $isActive: boolean }>`
  height: 25px;
  width: 25px;
  margin-top: 10px;
  margin-right: 10px;
  background-color: #555;
  color: chartreuse;
  ${(props) =>
    props.$isActive ? "background-color: blue;" : "background-color: gray;"}
`;

function App() {
  const [rhythmSynth, setRhythmSynth] = useState<Tone.PolySynth>();
  const [leadSynth, setLeadSynth] = useState<Tone.PolySynth>();
  const [snare, setSnare] = useState<Tone.NoiseSynth>();
  const [bass, setBass] = useState<Tone.MembraneSynth>();

  const [progression, setProgression] = useState<Array<string>>([]);
  const [melody, setMelody] = useState<Array<MelodyPiece>>([]);
  const [initApp, setInitApp] = useState<boolean>(false);
  const [beatNumber, setBeatNumber] = useState<number>(-1);
  const [beatInfo, setBeatInfo] = useState<Array<BeatInfo>>([]);

  useEffect(() => {
    if (initApp) {
      setRhythmSynth(makeRhythmSynth());
      setLeadSynth(makeLeadSynth());
      setSnare(makeSnareDrum());
      setBass(makeBassDrum());

      Tone.Transport.scheduleRepeat(() => {
        setBeatNumber((beatNumber) => beatNumber + 1);
      }, "4n");

      const beats = [];
      for (let i = 0; i <= 15; i++) {
        beats.push(i);
      }
    }
  }, [initApp]);

  useEffect(() => {}, [melody]);

  const generateNewProgression = () => {
    setInitApp(true);
    const songInfo = makeRandomProgression();
    setProgression(songInfo.chordProgression);
    setMelody(songInfo.melody);

    const chordBeats: Array<BeatInfo> = new Array<BeatInfo>(NUMBER_OF_BEATS);
    for (let i = 0; i < NUMBER_OF_BEATS; i++) {
      chordBeats[i] = { beatNumber: i, rhythm: "" } as BeatInfo;
    }

    for (let i = 0; i < songInfo.chordProgression.length; i++) {
      chordBeats[i * 4].rhythm = chords[songInfo.chordProgression[i]].chordName;
    }

    const leadBeats: Array<BeatInfo> = new Array<BeatInfo>(NUMBER_OF_BEATS);
    for (let i = 0; i < NUMBER_OF_BEATS; i++) {
      leadBeats[i] = { beatNumber: i, lead: "" } as BeatInfo;
    }

    for (let i = 0; i < songInfo.melody.length; i++) {
      leadBeats[songInfo.melody[i].beatNumber].lead = songInfo.melody[i].note;
    }

    const bassBeats = makeBassDrumLoop();
    const snareBeats = makeSnareLoop();

    const newBeatInfo: Array<BeatInfo> = new Array<BeatInfo>(NUMBER_OF_BEATS);

    for (let i = 0; i < NUMBER_OF_BEATS; i++) {
      newBeatInfo[i] = {} as BeatInfo;
      newBeatInfo[i].beatNumber = i;
      newBeatInfo[i].bassDrum = bassBeats[i].bassDrum;
      newBeatInfo[i].snareDrum = snareBeats[i].snareDrum;
      newBeatInfo[i].lead = leadBeats[i].lead;
      newBeatInfo[i].rhythm = chordBeats[i].rhythm;
    }

    setBeatInfo(newBeatInfo);
  };

  useEffect(() => {
    console.log(
      `Current beat: ${beatNumber}. Current beat in loop: ${beatNumber % 16}`
    );
  }, [beatNumber]);

  const playProgression = () => {
    const chordProgression: Array<Array<string>> = [];
    progression?.map((chord: string) => {
      const chordNotes = chords[chord];
      chordProgression.push(chordNotes.notes);
    });

    makeRhythmLoop(rhythmSynth!, chordProgression);
    makeMelodyLoop(leadSynth!, melody);
    playBassDrumLoop(bass!);
    playSnareDrumLoop(snare!);

    Tone.Transport.start();
  };

  useEffect(() => {
    console.log(beatInfo);
  }, [beatInfo]);

  return (
    <>
      <div>
        {beatInfo.length === 0 ? (
          <button onClick={generateNewProgression}>Make Progression</button>
        ) : (
          <>
            <div>
              Chord Progression:{" "}
              {progression && progression.map((chord) => chord).join(" - ")}
            </div>
            <button onClick={playProgression}>Play Progression</button>
          </>
        )}
      </div>
      <Beats>
        {beatInfo.map((beat) => {
          return (
            <Square $isActive={beat.beatNumber === beatNumber % 16}> </Square>
          );
        })}
      </Beats>
      <Beats>
        {beatInfo.map((beat) => {
          return (
            <Square
              $isActive={
                beat.beatNumber === beatNumber % 16 && beat.rhythm !== ""
              }
            >
              {beat.rhythm}
            </Square>
          );
        })}
      </Beats>
      <Beats>
        {beatInfo.map((beat) => {
          return (
            <Square
              $isActive={
                beat.beatNumber === beatNumber % 16 && beat.lead !== ""
              }
            >
              {beat.lead}
            </Square>
          );
        })}
      </Beats>
      <Beats>
        {beatInfo.map((beat) => {
          return (
            <Square
              $isActive={
                beat.beatNumber === beatNumber % 16 && beat.snareDrum === "S"
              }
            >
              {beat.snareDrum}
            </Square>
          );
        })}
      </Beats>
      <Beats>
        {beatInfo.map((beat) => {
          return (
            <Square
              $isActive={
                beat.beatNumber === beatNumber % 16 && beat.bassDrum === "B"
              }
            >
              {beat.bassDrum}
            </Square>
          );
        })}
      </Beats>

      {}
    </>
  );
}

export default App;
