import * as Tone from "tone";
import { Beat, TrackSynth } from "../types/types";
import { NUMBER_OF_BARS } from "../types/music_types";
import { makeTrackMidiNotes } from "./midi";
import { Output } from "webmidi";
import { LyricLine } from "../api/api";
import { scheduleMidiPlayback, scheduleVocalsCallback } from "./schedule";
import { Dispatch, SetStateAction } from "react";

const triggerPolySynthSample = (synth: Tone.PolySynth, beat: Beat) => {
  synth.triggerAttackRelease(beat.beatData, beat.length, beat.triggerTime);
};

const triggerMembraneSynthSample = (synth: Tone.MembraneSynth, beat: Beat) => {
  synth.triggerAttackRelease(beat.beatData[0], beat.length, beat.triggerTime);
};

const triggerNoiseSynthSample = (synth: Tone.NoiseSynth, beat: Beat) => {
  synth.triggerAttackRelease(beat.length, beat.triggerTime);
};

const triggerSample = (player: Tone.Player, beat: Beat) => {
  player.start(beat.triggerTime, 0, beat.length);
};

export const makeTrackLoop = (
  synth: TrackSynth,
  beats: Array<Beat>,
  midiOut: Output | undefined,
  channelIdx: number,
  trackName: string,
  setCurrentWord: Dispatch<SetStateAction<number>>,
  lyrics: Array<LyricLine>
): Tone.Loop => {
  const notes = makeTrackMidiNotes(beats);
  const loop = new Tone.Loop(() => {
    beats.forEach((beat, index) => {
      if (beat.length) {
        if (synth.polySynth) {
          triggerPolySynthSample(synth.polySynth, beat);
        } else if (synth.membraneSynth) {
          triggerMembraneSynthSample(synth.membraneSynth, beat);
        } else if (synth.noiseSynth) {
          triggerNoiseSynthSample(synth.noiseSynth, beat);
        } else if (synth.samplePlayers) {
          if (beat.label) {
            triggerSample(synth.samplePlayers[beat.label], beat);
          }
        }

        scheduleMidiPlayback(
          beat.beatData,
          beat.triggerTime,
          notes[index].duration[0],
          midiOut,
          channelIdx
        );

        if (trackName === "Vocals") {
          scheduleVocalsCallback(lyrics, beat.triggerTime, setCurrentWord);
        }
      }
    });
  }, `${NUMBER_OF_BARS}m`).start(0);

  return loop;
};
