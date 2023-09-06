import { TrackData } from "../helpers/types/types";
import Vex from "vexflow";
import { useEffect } from "react";
import { timeToEights } from "../helpers/music/midi";
import { useRef } from "react";
import { BeatLengthToDuration, Beat } from "../helpers/types/types";
import styled from "styled-components";

const STAVE_WIDTH = 1700;
const STAVE_HEIGHT = 1250;
const STAVE_GAP = 150;

type NotationProps = {
  trackData: Array<TrackData>;
};

type StaveVoice = {
  stave: Vex.Stave;
  voice: Vex.Voice;
};

type VexFlowNotes = {
  notes: Array<string>;
  flats: Array<number>;
};

const NotationContainer = styled.div`
  display: flex;
  margin-top: 20px;
  width: 1060px;
  height: 500px;
`;

const beatLengthToDuration: BeatLengthToDuration = {
  4: "w",
  1: "q",
  0.5: "8",
};

const getVexFlowFormatNotes = (notes: Array<string>): VexFlowNotes => {
  const flats: Array<number> = [];
  const vexNotes = notes.map((note, index) => {
    const noteName = note.charAt(0);
    const octave = note.charAt(note.length - 1);

    if (note.charAt(1) === "b") {
      flats.push(index);
    }

    return `${noteName}/${octave}`;
  });
  return { notes: vexNotes, flats: flats };
};

const getVexNotesFromTrackBeats = (
  beats: Beat[],
  clef: string
): Array<Vex.StaveNote> => {
  const notes: Array<Vex.StaveNote> = [];

  let prevBeat: Beat = {
    triggerTime: "+0:0",
    beatLength: 0,
    beatNumber: 0,
    length: "0",
    beatData: [],
    label: "",
  };

  beats.forEach((beat) => {
    const vexNotes = getVexFlowFormatNotes(beat.beatData);
    if (prevBeat) {
      addRests(
        prevBeat["triggerTime"],
        prevBeat.beatLength,
        beat.triggerTime,
        notes
      );
    }

    const duration = beatLengthToDuration[beat.beatLength];

    const staveNote = new Vex.Flow.StaveNote({
      keys: vexNotes.notes,
      duration: duration,
      clef: clef,
    });

    vexNotes.flats.forEach((flatIndex) => {
      staveNote.addModifier(new Vex.Flow.Accidental("b"), flatIndex);
    });

    notes.push(staveNote);
    prevBeat = beat;
  });

  addRests(prevBeat["triggerTime"], prevBeat.beatLength, "+4:0", notes);

  return notes;
};

const addRests = (
  prevTrigger: string,
  prevBeatLength: number,
  currTrigger: string,
  notes: Array<Vex.StaveNote>
) => {
  const prevEights = timeToEights(prevTrigger);
  const currEights = timeToEights(currTrigger);
  const numRests = currEights - prevEights - prevBeatLength / 0.5;
  for (let i = 0; i < numRests; i++) {
    notes.push(new Vex.StaveNote({ keys: ["r/8"], duration: "8r" }));
  }
};

export const Notation = (notationProps: NotationProps) => {
  const { trackData } = notationProps;
  const notationCanvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<Vex.Renderer>();
  const context = useRef<Vex.RenderContext>();

  useEffect(() => {
    renderer.current = new Vex.Flow.Renderer(
      notationCanvas.current!,
      Vex.Flow.Renderer.Backends.CANVAS
    );
    renderer.current.resize(STAVE_WIDTH, STAVE_HEIGHT);
    context.current = renderer.current.getContext();
    context.current.scale(0.5, 0.5);
  }, []);

  useEffect(() => {
    if (trackData.length === 0) return;
    if (renderer.current === undefined) return;
    if (!notationCanvas || !notationCanvas.current) return;
    notationCanvas.current
      .getContext("2d")!
      .clearRect(
        0,
        0,
        notationCanvas.current.width,
        notationCanvas.current.height
      );
    const staveVoices: Array<StaveVoice> = [];

    let trackCnt = 0;
    trackData.forEach((track) => {
      if (!["Pads", "Melody", "Bass", "Vocals"].includes(track.name)) return;

      const clef = track.name === "Bass" ? "bass" : "treble";
      const stave = new Vex.Flow.Stave(0, trackCnt * STAVE_GAP, STAVE_WIDTH);
      stave.addClef(clef).addTimeSignature("4/4");
      stave.setContext(context.current).draw();
      trackCnt += 1;

      const notes: Array<Vex.StaveNote> = getVexNotesFromTrackBeats(
        track.beats,
        clef
      );

      const voice = new Vex.Flow.Voice({
        num_beats: 16,
        beat_value: 4,
        resolution: Vex.Flow.RESOLUTION,
      });

      voice.addTickables(notes).setStave(stave);

      staveVoices.push({ stave: stave, voice: voice } as StaveVoice);
    });

    const formatter = new Vex.Flow.Formatter();

    const voices = staveVoices.map((staveVoice) => {
      return staveVoice.voice;
    });
    formatter.format(voices, STAVE_HEIGHT);

    let startX = 0;
    staveVoices.forEach((staveVoice) => {
      startX = Math.max(staveVoice.stave.getNoteStartX());
    });

    staveVoices.forEach((staveVoice) => {
      staveVoice.stave.setNoteStartX(startX);
      staveVoice.voice.setContext(context.current).draw();
    });
  }, [trackData]);

  return (
    <NotationContainer>
      <canvas ref={notationCanvas} />
    </NotationContainer>
  );
};
