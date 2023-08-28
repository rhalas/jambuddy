import MidiWriter from "midi-writer-js";
import { TrackData } from "../types/types";
import { TONE_LENGTHS_TO_EIGHTH_NOTES } from "../types/music_types";

const downloadURI = (uri: string, name: string) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const timeToEights = (time: string): number => {
  const splitTime = time.split(":");
  const barNumber = Number(splitTime[0].substring(1));
  const measureNumber = Number(splitTime[1]);
  return Math.floor(barNumber * 8) + Math.floor(measureNumber / 0.5);
};

const midiBeatsBetweenTimes = (
  previousEighths: number,
  previousTrigger: string,
  currentTrigger: string
): Array<MidiWriter.Duration> => {
  const beatsToWait: Array<MidiWriter.Duration> = [];
  const measures1 = timeToEights(previousTrigger);
  const measures2 = timeToEights(currentTrigger);
  const eighthWaits = Math.abs(measures2 - measures1) - previousEighths;

  for (let i = 0; i < eighthWaits; i++) {
    beatsToWait.push("8");
  }

  return beatsToWait;
};

export const makeTrackMidiNotes = (
  beats: Array<Beat>
): Array<MidiWriter.NoteEvent> => {
  const notes: Array<MidiWriter.NoteEvent> = [];

  let previousTrigger = "+0:0";
  let previousBeatLength = 0;

  beats.forEach((beat) => {
    const beatsToWait = midiBeatsBetweenTimes(
      previousBeatLength,
      previousTrigger,
      beat.triggerTime
    );
    previousBeatLength = TONE_LENGTHS_TO_EIGHTH_NOTES[beat.length];
    previousTrigger = beat.triggerTime;

    const note = new MidiWriter.NoteEvent({
      pitch: beat.beatData as MidiWriter.Pitch[],
      duration: beat.length.charAt(0) as MidiWriter.Duration,
      wait: beatsToWait,
    });
    notes.push(note);
  });

  return notes;
};

export const exportToMidi = (tracks: Array<TrackData>, tempo: number) => {
  const midiTracks: Array<MidiWriter.Track> = [];

  tracks.forEach((track) => {
    if (track.name === "Guitar") {
      return;
    }

    const midiTrack = new MidiWriter.Track();
    midiTrack.setTempo(tempo, 0);
    midiTrack.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));

    const notes = makeTrackMidiNotes(track.beats);
    notes.forEach((note) => {
      midiTrack.addEvent(note);
    });

    midiTrack.addTrackName(track.name);

    midiTracks.push(midiTrack);
  });
  const write = new MidiWriter.Writer(midiTracks);
  downloadURI(write.dataUri(), "song.midi");
};
