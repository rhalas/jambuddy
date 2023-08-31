import * as Tone from "tone";
import { Beat, TrackData } from "../types/types";
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
  track: TrackData,
  midiOut: Output | undefined,
  channelIdx: number,
  setCurrentWord: Dispatch<SetStateAction<number>>,
  lyrics: Array<LyricLine>
): Tone.Loop => {
  const notes = makeTrackMidiNotes(track.beats);
  const loop = new Tone.Loop(() => {
    track.beats.forEach((beat, index) => {
      if (beat.length) {
        if (track.synth.polySynth) {
          triggerPolySynthSample(track.synth.polySynth, beat);
        } else if (track.synth.membraneSynth) {
          triggerMembraneSynthSample(track.synth.membraneSynth, beat);
        } else if (track.synth.noiseSynth) {
          triggerNoiseSynthSample(track.synth.noiseSynth, beat);
        } else if (track.synth.samplePlayers) {
          if (beat.label) {
            triggerSample(track.synth.samplePlayers[beat.label], beat);
          }
        }

        scheduleMidiPlayback(
          beat.beatData,
          beat.triggerTime,
          notes[index].duration[0],
          midiOut,
          channelIdx
        );

        if (track.name === "Vocals") {
          scheduleVocalsCallback(lyrics, beat.triggerTime, setCurrentWord);
        }
      }
    });
  }, `${NUMBER_OF_BARS}m`).start(0);

  return loop;
};
