import * as Tone from "tone";
import { SongSynths, TrackSynth } from "../types/types";

export const makeNewSongSynths = (): SongSynths => {
  return {
    rhythm: makeRhythmSynth(),
    lead: makeLeadSynth(),
    vocal: makeVocalSynth(),
    snareDrum: makeSnareDrum(),
    bassDrum: makeBassDrum(),
    bass: makeBassSynth(),
    closedHiHat: makeClosedHiHat(),
    openHiHat: makeOpenHiHat(),
  };
};

export const makeSnareDrum = (): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const lowPass = new Tone.Filter({
    frequency: 8000,
  }).toDestination();

  const newSynth = new Tone.NoiseSynth({
    volume: -3,
    noise: {
      type: "white",
      playbackRate: 3,
    },
    envelope: {
      attack: 0.001,
      decay: 0.2,
      sustain: 0.15,
      release: 0.03,
    },
  })
    .fan(meter, fft)
    .connect(lowPass);

  return { noiseSynth: newSynth, meter: meter, fft: fft };
};

export const makeBassDrum = (): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const newSynth = new Tone.MembraneSynth({
    volume: 3,
  })
    .fan(meter, fft)
    .toDestination();

  return { membraneSynth: newSynth, meter: meter, fft: fft };
};

export const makeLeadSynth = (): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const newLeadSynth = new Tone.PolySynth(Tone.Synth, {
    volume: -2,
    oscillator: {
      type: "amsawtooth3",
    },
    portamento: 0.005,
  })
    .fan(meter, fft)
    .toDestination();

  const reverb = new Tone.Reverb({
    decay: 10.0,
    preDelay: 0.01,
  }).toDestination();
  newLeadSynth.connect(reverb);

  return { polySynth: newLeadSynth, meter: meter, fft: fft };
};

export const makeVocalSynth = (): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const newVocalSynth = new Tone.PolySynth(Tone.Synth, {
    volume: -12,
    oscillator: {
      type: "square",
    },
    portamento: 0.005,
  })
    .fan(meter, fft)
    .toDestination();

  const reverb = new Tone.Reverb({
    decay: 10.0,
    preDelay: 0.01,
  }).toDestination();
  newVocalSynth.connect(reverb);

  return { polySynth: newVocalSynth, meter: meter, fft: fft };
};

export const makeRhythmSynth = (): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const newRhythmSynth = new Tone.PolySynth(Tone.Synth)
    .fan(meter, fft)
    .toDestination();
  newRhythmSynth.set({
    volume: -10,
    oscillator: {
      type: "fatsine9",
    },
  });

  const reverb = new Tone.Reverb({
    decay: 10.0,
    preDelay: 0.01,
  }).toDestination();
  newRhythmSynth.connect(reverb);

  return { polySynth: newRhythmSynth, meter: meter, fft: fft };
};

export const makeBassSynth = (): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const newBassSynth = new Tone.PolySynth(Tone.Synth, {
    volume: -7,
    oscillator: {
      type: "sawtooth",
    },
  })
    .fan(meter, fft)
    .toDestination();

  return { polySynth: newBassSynth, meter: meter, fft: fft };
};

export const makeClosedHiHat = (): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const lowPass = new Tone.Filter({
    frequency: 8000,
  }).toDestination();

  const newHiHatSynth = new Tone.NoiseSynth({
    volume: -5,
    envelope: {
      attack: 0.01,
      decay: 0.15,
    },
  })
    .fan(meter, fft)
    .connect(lowPass);

  return { noiseSynth: newHiHatSynth, meter: meter, fft: fft };
};

export const makeOpenHiHat = (): TrackSynth => {
  const lowPass = new Tone.Filter({
    frequency: 14000,
  }).toDestination();

  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const openHiHat = new Tone.NoiseSynth({
    volume: -6,
    envelope: {
      attack: 0.01,
      decay: 0.3,
    },
  })
    .fan(meter, fft)
    .connect(lowPass);

  return { noiseSynth: openHiHat, meter: meter, fft: fft };
};
