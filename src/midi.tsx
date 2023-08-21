import MidiWriter from "midi-writer-js";
import { TrackData } from "./types";

const downloadURI = (uri: string, name: string) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToMidi = (tracks: Array<TrackData>, tempo: number) => {
  const midiTracks: Array<MidiWriter.Track> = [];

  tracks.forEach((track) => {
    const midiTrack = new MidiWriter.Track();
    midiTrack.setTempo(tempo, 0);
    midiTrack.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));
    track.beats.forEach((beat) => {
      const note = new MidiWriter.NoteEvent({
        pitch: beat.beatData,
        duration: beat.length.charAt(0),
        wait: beat.beatsSinceLastNote,
      });
      if (track.name === "Melody") {
        console.log(note);
      }
      midiTrack.addEvent(note);
    });

    midiTrack.addTrackName(track.name);

    midiTracks.push(midiTrack);
  });
  const write = new MidiWriter.Writer(midiTracks);
  downloadURI(write.dataUri(), "song.midi");
};
