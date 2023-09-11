import * as Tone from "tone";
import { SongSynths, TrackSynth } from "../types/types";

export const makeNewSongSynths = (defaultVolume: number): SongSynths => {
  const masterVol = new Tone.Volume(defaultVolume).toDestination();

  return {
    masterVol: masterVol,
    rhythm: makeRhythmSynth(masterVol),
    lead: makeLeadSynth(masterVol),
    vocal: makeVocalSynth(masterVol),
    snareDrum: makeSnareDrum(masterVol),
    bassDrum: makeBassDrum(masterVol),
    bass: makeBassSynth(masterVol),
    closedHiHat: makeClosedHiHat(masterVol),
    openHiHat: makeOpenHiHat(masterVol),
  };
};

export const makeSnareDrum = (masterVol: Tone.Volume): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const lowPass = new Tone.Filter({
    frequency: 8000,
  }).connect(masterVol);

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

export const makeBassDrum = (masterVol: Tone.Volume): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const newSynth = new Tone.MembraneSynth({
    volume: 3,
  })
    .fan(meter, fft)
    .connect(masterVol);

  return { membraneSynth: newSynth, meter: meter, fft: fft };
};

export const makeLeadSynth = (masterVol: Tone.Volume): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const newLeadSynth = new Tone.PolySynth(Tone.Synth, {
    volume: 0,
    oscillator: {
      type: "fmsawtooth11",
    },
    portamento: 0.005,
  })
    .fan(meter, fft)
    .connect(masterVol);

  return { polySynth: newLeadSynth, meter: meter, fft: fft };
};

export const makeVocalSynth = (masterVol: Tone.Volume): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const newVocalSynth = new Tone.PolySynth(Tone.Synth, {
    volume: -6,
    oscillator: {
      type: "square",
    },
    portamento: 0.005,
  }).fan(meter, fft);

  const reverb = new Tone.Reverb({
    decay: 20.0,
    preDelay: 0.01,
  }).connect(masterVol);

  newVocalSynth.connect(reverb);

  return { polySynth: newVocalSynth, meter: meter, fft: fft };
};

export const makeRhythmSynth = (masterVol: Tone.Volume): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const newRhythmSynth = new Tone.PolySynth(Tone.Synth).fan(meter, fft);
  newRhythmSynth.set({
    volume: 3,
    oscillator: {
      type: "fatsine9",
    },
  });

  const reverb = new Tone.Reverb({
    decay: 10.0,
    preDelay: 0.01,
  }).connect(masterVol);
  newRhythmSynth.connect(reverb);

  return { polySynth: newRhythmSynth, meter: meter, fft: fft };
};

export const makeBassSynth = (masterVol: Tone.Volume): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const newBassSynth = new Tone.PolySynth(Tone.Synth, {
    volume: 0,
    oscillator: {
      type: "sawtooth",
    },
  })
    .fan(meter, fft)
    .connect(masterVol);

  return { polySynth: newBassSynth, meter: meter, fft: fft };
};

export const makeClosedHiHat = (masterVol: Tone.Volume): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);

  const lowPass = new Tone.Filter({
    frequency: 8000,
  }).connect(masterVol);

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

export const makeOpenHiHat = (masterVol: Tone.Volume): TrackSynth => {
  const lowPass = new Tone.Filter({
    frequency: 14000,
  }).connect(masterVol);

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
