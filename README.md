# JamBuddy

Demo: [https://jambuddy.vercel.app/](https://jambuddy.vercel.app/)

An app to generate full songs with minimal user input.

To start with, the user is given the option to generate song lyrics based on a topic of their choice. This creation is powered by an API running [nanana](https://github.com/rhalas/nanana) which generates a request to OpenAI to write a custom set of lyrics.

Once we have lyrics, we pick a random key and generate a random diatonic chord progression as the basis for the song. Using this progression we can then generate a set of tracks (melody, vocals, bass) using random notes and durations from the selected scale. A set of instruments are created using Tone.js which are used to play the newly created sounds.

Some other features include:

- Extend song to as many bars as needed in same/different keys as well as customize the sequence they get played in
- Connect directly to DAWs (eg. Logic/Ableton) and play creation with your own instruments by outputting to a virtual MIDI device through use of [WebMIDI](https://webmidijs.org/)
- Export the current song being played to MIDI through used of [midi-writer-js](https://www.npmjs.com/package/midi-writer-js)
- See musical notation of what's being played by using [VexFlow](https://www.vexflow.com/)
