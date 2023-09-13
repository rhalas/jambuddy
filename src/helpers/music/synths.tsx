import * as Tone from "tone";
import { SongSynths, TrackSynth } from "../types/types";
import { DEFAULT_TRACK_VOLUME } from "../types/music_types";

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
  const vol = new Tone.Volume(DEFAULT_TRACK_VOLUME)
    .fan(meter, fft)
    .connect(masterVol);

  const lowPass = new Tone.Filter({
    frequency: 8000,
  }).connect(vol);

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
  }).connect(lowPass);

  return { noiseSynth: newSynth, meter: meter, fft: fft, volumeControl: vol };
};

export const makeBassDrum = (masterVol: Tone.Volume): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);
  const vol = new Tone.Volume(DEFAULT_TRACK_VOLUME)
    .fan(meter, fft)
    .connect(masterVol);

  const newSynth = new Tone.MembraneSynth({
    volume: 3,
  }).connect(vol);

  return {
    membraneSynth: newSynth,
    meter: meter,
    fft: fft,
    volumeControl: vol,
  };
};

export const makeLeadSynth = (masterVol: Tone.Volume): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);
  const vol = new Tone.Volume(DEFAULT_TRACK_VOLUME)
    .fan(meter, fft)
    .connect(masterVol);

  const chorus = new Tone.Chorus({
    frequency: 1.5,
    delayTime: 3.5,
    depth: 0.7,
    type: "sine",
    spread: 180,
  }).connect(vol);

  const newLeadSynth = new Tone.PolySynth(Tone.Synth, {
    volume: 0,
    oscillator: {
      type: "fmsawtooth11",
    },
    portamento: 0.005,
  }).connect(chorus);

  return {
    polySynth: newLeadSynth,
    meter: meter,
    fft: fft,
    volumeControl: vol,
  };
};

export const makeVocalSynth = (masterVol: Tone.Volume): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);
  const vol = new Tone.Volume(DEFAULT_TRACK_VOLUME)
    .fan(meter, fft)
    .connect(masterVol);

  const newVocalSynth = new Tone.PolySynth(Tone.Synth, {
    volume: -6,
    oscillator: {
      type: "square",
    },
    portamento: 0.005,
  });

  const reverb = new Tone.Reverb({
    decay: 20.0,
    preDelay: 0.01,
  }).connect(vol);

  newVocalSynth.connect(reverb);

  return {
    polySynth: newVocalSynth,
    meter: meter,
    fft: fft,
    volumeControl: vol,
  };
};

export const makeRhythmSynth = (masterVol: Tone.Volume): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);
  const vol = new Tone.Volume(DEFAULT_TRACK_VOLUME)
    .fan(meter, fft)
    .connect(masterVol);

  const newRhythmSynth = new Tone.PolySynth(Tone.Synth);
  newRhythmSynth.set({
    volume: 8,
    oscillator: {
      type: "fatsine9",
    },
  });

  const reverb = new Tone.Reverb({
    decay: 10.0,
    preDelay: 0.01,
  }).connect(vol);

  const tremolo = new Tone.Tremolo({
    frequency: 10,
    type: "sine",
    depth: 0.5,
    spread: 180,
  }).connect(reverb);

  newRhythmSynth.connect(tremolo);

  return {
    polySynth: newRhythmSynth,
    meter: meter,
    fft: fft,
    volumeControl: vol,
  };
};

export const makeBassSynth = (masterVol: Tone.Volume): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);
  const vol = new Tone.Volume(DEFAULT_TRACK_VOLUME)
    .fan(meter, fft)
    .connect(masterVol);

  const newBassSynth = new Tone.PolySynth(Tone.Synth, {
    volume: 0,
    oscillator: {
      type: "sawtooth",
    },
  }).connect(vol);

  return {
    polySynth: newBassSynth,
    meter: meter,
    fft: fft,
    volumeControl: vol,
  };
};

export const makeClosedHiHat = (masterVol: Tone.Volume): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);
  const vol = new Tone.Volume(DEFAULT_TRACK_VOLUME)
    .fan(meter, fft)
    .connect(masterVol);

  const lowPass = new Tone.Filter({
    frequency: 8000,
  }).connect(vol);

  const newHiHatSynth = new Tone.NoiseSynth({
    volume: -5,
    envelope: {
      attack: 0.01,
      decay: 0.15,
    },
  }).connect(lowPass);

  return {
    noiseSynth: newHiHatSynth,
    meter: meter,
    fft: fft,
    volumeControl: vol,
  };
};

export const makeOpenHiHat = (masterVol: Tone.Volume): TrackSynth => {
  const meter = new Tone.Meter();
  const fft = new Tone.FFT(64);
  const vol = new Tone.Volume(DEFAULT_TRACK_VOLUME)
    .fan(meter, fft)
    .connect(masterVol);

  const lowPass = new Tone.Filter({
    frequency: 14000,
  }).connect(vol);

  const openHiHat = new Tone.NoiseSynth({
    volume: -6,
    envelope: {
      attack: 0.01,
      decay: 0.3,
    },
  }).connect(lowPass);

  return { noiseSynth: openHiHat, meter: meter, fft: fft, volumeControl: vol };
};
