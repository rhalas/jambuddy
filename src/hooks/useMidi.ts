import { useState, useEffect } from "react";
import { WebMidi, Output } from "webmidi";

export const useMIDI = () => {
    const [midiOutputs, setMidiOutputs] = useState(Array<Output>);
    const [midiError, setMidiError] = useState();

    useEffect(() => {
        WebMidi.enable()
        .then(() => {
            setMidiOutputs(WebMidi.outputs);
        })
        .catch((err) => setMidiError(err));    
    });
    
    return {
        midiOutputs,
        midiError,
    }
}