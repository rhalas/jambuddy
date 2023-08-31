import * as Tone from "tone";
import { Dispatch, SetStateAction } from "react";
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

export const scheduleBeatIncrement = (
  setBeatNumber: Dispatch<SetStateAction<number>>
) => {
  Tone.Transport.scheduleRepeat(() => {
    setBeatNumber((b) => b + 1);
  }, `4n`);
};

export const scheduleMidiPlayback = (
  beatData: Array<string>,
  triggerTime: string,
  duration: string,
  midiOut: Output | undefined,
  channelIdx: number
) => {
  if (midiOut) {
    const channel = midiOut!.channels[channelIdx];
    Tone.Transport.schedule(() => {
      if (beatData) {
        channel.playNote(beatData, {
          duration: noteDurationToMs(duration),
        });
      }
    }, triggerTime);
  }
};

export const scheduleVocalsCallback = (
  lyrics: Array<LyricLine>,
  triggerTime: string,
  setCurrentWord: Dispatch<SetStateAction<number>>
) => {
  Tone.Transport.schedule(() => {
    if (lyrics.length > 0) {
      setCurrentWord((s: number) =>
        s >= lyrics[lyrics.length - 1].endWord ? 0 : s + 1
      );
    }
  }, triggerTime);
};
