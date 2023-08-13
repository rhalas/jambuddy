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
      partials: [1, 2, 5],
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
    oscillator: {
      type: "sine5",
      volume: -6,
    },
    envelope: {
      attack: 0.1,
      decay: 0.4,
      sustain: 0.3,
      release: 0.7,
    },
  });
  return newRhythmSynth;
};
