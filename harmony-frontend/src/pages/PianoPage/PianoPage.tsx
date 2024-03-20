import {useEffect, useState} from "react";
import {socket} from "../../socket.ts";
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import {log} from "tone/build/esm/core/util/Debug";

interface Note {
    on: number;
    pitch: number;
    velocity: number;
}

const PianoPage = () => {
    const [context, setContext] = useState(new AudioContext());
    // const context: AudioContext = new AudioContext();
    // let context: AudioContext;
    // const oscillators: Record<number, OscillatorNode> = {};
    const [oscillators, setOscillators] =
        useState<Record<number, OscillatorNode>>({});
    // const [oscillators, setOscillators] = useState<OscillatorNode>();

    const [isConnected, setIsConnected] = useState(socket.connected);

    const [activeNotes, setActiveNotes] = useState<number[]>([]);
    const [colorId, setColorId] = useState(1);

    let midi: MIDIAccess | undefined;

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
                setContext(new AudioContext());
            })
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess({
                sysex: false
            }).then(onMIDISuccess, onMIDIFailure);
        } else {
            console.log("No puede haber tiki tiki porque no tenes soporte para MIDI.");
        }
    }, [])

    useEffect(() => {
        function onConnect() {
            console.log("me conecte al socket desde el cliente!")
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('color_id', (value) => {
            setColorId(value)
        })
        socket.on('presskey', (noteToPlay: string) => {
            console.log(`reproduciendo ${noteToPlay}`)
            // playSynth(noteToPlay)
        })
        socket.on('serverMidi', gotExternalMidiMessage);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, [socket]);

    function gotExternalMidiMessage(data: Note) {
        play(data)
    }

    function onMIDImessage(messageData: MIDIMessageEvent) {
        const note: Note = {
            on: messageData.data[0],
            pitch: messageData.data[1],
            velocity: messageData.data[2]
        }
        // play(note);
        socket.emit('clientMidi', note);
        // No toco la nota si es local. Solo suenan las notas que vienen del servidor.
    }

    function play(note: Note){
        const pitch = note.pitch;
        switch(note.on) {
            case 144:
                noteOn(pitch, calculateFrequency(pitch));
                break;
            case 128:
                noteOff(pitch, calculateFrequency(pitch));
                break;
        }
    }

    function calculateFrequency(pitch: number) {
        return Math.pow(2, ((pitch - 69) / 12)) * 440;
    }

    function noteOn(pitch: number, frequency: number) {
        const osc = new OscillatorNode(context);
        setOscillators(prevOscillators => ({
            ...prevOscillators,
            [frequency]: osc
        }));
        setActiveNotes(prevState => {
            return [...prevState, pitch]
        });
        context.resume();
        osc.type = 'sawtooth';
        osc.frequency.value = frequency;
        osc.connect(context.destination);
        osc.start(context.currentTime);
        osc.stop(context.currentTime + 0.5);
    }

    // TODO arreglar el useState para que oscilators se carge correctamente
    function noteOff(pitch: number, frequency: number) {
        setActiveNotes(prevState => prevState.filter(note => note !== pitch));
        context.resume();
        // oscillators?.stop(context.currentTime + 0.1);z
        console.log(oscillators)
        const currentOscillator = oscillators[frequency];
        if (currentOscillator) {
            currentOscillator.stop(context.currentTime);
            currentOscillator.disconnect();
        }
    }

    function onMIDISuccess(midiData: MIDIAccess) {
        midi = midiData;
        console.log(midi)
        const allInputs = midi.inputs.values();
        for (let input = allInputs.next(); input && !input.done; input = allInputs.next()) {
            input.value.onmidimessage = onMIDImessage;
        }
    }

    function onMIDIFailure() {
        console.log("No puede haber tiki tiki porque no se encontro un MIDI.");
    }

    const firstNote = MidiNumbers.fromNote('c3');
    const lastNote = MidiNumbers.fromNote('b4');
    const keyboardShortcuts = KeyboardShortcuts.create({
        firstNote: firstNote,
        lastNote: lastNote,
        keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });
    return (
        <div>
            <Piano
                noteRange={{ first: firstNote, last: lastNote }}
                playNote={(midiNumber) => {
                    console.log(midiNumber)
                }}
                stopNote={(midiNumber) => {
                    // Stop playing a given note - see notes below
                }}
                width={1000}
                activeNotes={activeNotes}
            />
        </div>
    );
};

export default PianoPage;
