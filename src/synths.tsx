import * as Tone from "tone";

const lowPass = new Tone.Filter({
  frequency: 8000,
}).toDestination();

export const makeSnareDrum = () => {
  return new Tone.NoiseSynth({
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
};

export const makeBassDrum = () => {
  return new Tone.MembraneSynth({
    volume: -2,
  }).toDestination();
};

export const makeLeadSynth = () => {
  const newLeadSynth = new Tone.PolySynth(Tone.Synth, {
    volume: -4,
    oscillator: {
      type: "sawtooth",
    },
    portamento: 0.005,
  }).toDestination();

  const reverb = new Tone.Reverb({
    decay: 10.0,
    preDelay: 0.01,
  }).toDestination();
  newLeadSynth.connect(reverb);

  return newLeadSynth;
};

export const makeRhythmSynth = () => {
  const newRhythmSynth = new Tone.PolySynth(Tone.Synth).toDestination();
  newRhythmSynth.set({
    volume: -6,
    oscillator: {
      type: "fatsine",
    },
    envelope: {
      attack: 0.2,
      decay: 0.1,
      sustain: 1,
      release: 1,
    },
    portamento: 0.2,
  });

  const reverb = new Tone.Reverb({
    decay: 10.0,
    preDelay: 0.01,
  }).toDestination();
  newRhythmSynth.connect(reverb);

  return newRhythmSynth;
};

export const makeBassSynth = () => {
  const newBassSynth = new Tone.PolySynth(Tone.Synth, {
    volume: -4,
    oscillator: {
      type: "sawtooth",
    },
  }).toDestination();

  const tremolo = new Tone.Tremolo({
    frequency: 10,
    type: "sine",
    depth: 0.5,
    spread: 180,
  }).toDestination();
  newBassSynth.connect(tremolo);

  return newBassSynth;
};
