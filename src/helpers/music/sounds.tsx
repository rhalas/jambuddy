import * as Tone from "tone";
import { Beat, TrackSynth } from "../types/types";
import { NUMBER_OF_BARS } from "../types/music_types";
import { makeTrackMidiNotes } from "./midi";
import { Output } from "webmidi";
import { LyricLine } from "../api/api";

const noteDurationToMs = (duration: string) => {
  const tempo = Tone.Transport.bpm.value;
  const timePerQuarterNote = 60000 / tempo;

  if (duration === "1") {
    return timePerQuarterNote * 4;
  } else if (duration === "4") {
    return timePerQuarterNote;
  } else if (duration === "8") {
    return timePerQuarterNote;
  } else {
    console.log("Invalid duraiton");
    return 0;
  }
};

export const makeTrackLoop = (
  synth: TrackSynth,
  beats: Array<Beat>,
  midiOut: Output | undefined,
  channelIdx: number,
  trackName: string,
  setCurrentWord: (s: any) => void,
  lyrics: Array<LyricLine>,
  currentWord: number
): Tone.Loop => {
  const notes = makeTrackMidiNotes(beats);
  const loop = new Tone.Loop(() => {
    beats.forEach((beat, index) => {
      if (beat.length) {
        if (synth.polySynth) {
          synth.polySynth.triggerAttackRelease(
            beat.beatData,
            beat.length,
            beat.triggerTime
          );
        } else if (synth.membraneSynth) {
          synth.membraneSynth.triggerAttackRelease(
            beat.beatData[0],
            beat.length,
            beat.triggerTime
          );
        } else if (synth.noiseSynth) {
          synth.noiseSynth.triggerAttackRelease(beat.length, beat.triggerTime);
        } else if (synth.samplePlayers) {
          if (beat.label) {
            const currentPlayer = synth.samplePlayers[beat.label];
            currentPlayer.start(beat.triggerTime, 0, beat.length);
          }
        }

        if (midiOut) {
          const channel = midiOut!.channels[channelIdx];
          Tone.Transport.schedule(() => {
            channel.playNote(beat.beatData, {
              duration: noteDurationToMs(notes[index].duration[0]),
            });
          }, beat.triggerTime);
        }

        if (trackName === "Vocals") {
          Tone.Transport.schedule(() => {
            if (lyrics.length > 0) {
              setCurrentWord((s: number) =>
                s >= lyrics[lyrics.length - 1].endWord ? 0 : s + 1
              );
            }
          }, beat.triggerTime);
        }
      }
    });
  }, `${NUMBER_OF_BARS}m`).start(0);

  return loop;
};
