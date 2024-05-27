import {useEffect, useState} from "react";
import {socket} from "../../socket.ts";
import {KeyboardShortcuts, MidiNumbers, Piano as ReactPiano} from "react-piano";
import 'react-piano/dist/styles.css';
import TryingToConnectIcon from "../../components/TryingToConnect/TryingToConnectIcon.tsx";
import {Piano} from "@tonejs/piano/build/piano/Piano";

interface Note {
    on: number;
    pitch: number;
    velocity: number;
}

interface MIDIEvent {
    composeId: string;
    userId: number;
    note: Note;
}

const midiToNoteMap: Map<number, string> = new Map([
    [48, "C3"],
    [49, "C#3"],
    [50, "D3"],
    [51, "D#3"],
    [52, "E3"],
    [53, "F3"],
    [54, "F#3"],
    [55, "G3"],
    [56, "G#3"],
    [57, "A3"],
    [58, "A#3"],
    [59, "B3"],
    [60, "C4"],
    [61, "C#4"],
    [62, "D4"],
    [63, "D#4"],
    [64, "E4"],
    [65, "F4"],
    [66, "F#4"],
    [67, "G4"],
    [68, "G#4"],
    [69, "A4"],
    [70, "A#4"],
    [71, "B4"]
]);


const PianoPage = ({song, enabled}) => {
    const [context, setContext] = useState(new AudioContext());
    const [oscillators, setOscillators] =
        useState<Record<number, OscillatorNode>>({});
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isSampleLoaded, setSampleLoaded] = useState(false);
    const [activeNotes, setActiveNotes] = useState<number[]>([]);
    const [colorId, setColorId] = useState(1);
    const [playedPianoNotes, setPlayedPianoNotes] = useState<number[]>([]);

    let midi: MIDIAccess | undefined;
    let tonePiano: Piano

    useEffect(() => {
        if (!isSampleLoaded) {
            tonePiano = new Piano({
                velocities: 5
            })
            tonePiano.toDestination()
            tonePiano.load().finally(() => {
                setSampleLoaded(true)
            })
        }


        navigator.mediaDevices.getUserMedia({audio: true})
            .then(() => {
                setContext(new AudioContext());
            })
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess({
                sysex: false
            }).then(onMIDISuccess, onMIDIFailure);
        } else {
            console.log("No MIDI support in your browser.");
        }
    }, [])

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('serverMidi', gotExternalMidiMessage);
        socket.on('colorId', (value) => {
            setColorId(value)
        })

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, [socket]);

    function gotExternalMidiMessage(data: MIDIEvent) {
        play(data.note)
    }

    function onMIDImessage(messageData: MIDIMessageEvent) {
        const note: Note = {
            on: messageData.data[0],
            pitch: messageData.data[1],
            velocity: messageData.data[2]
        }
        // No toco la nota si es local. Solo suenan las notas que vienen del servidor.
        // play(note);
        const userId = Number(localStorage.getItem("harmony-uid"))
        socket.emit('clientMidi', {composeId: song.composeid, userId: userId, note: note} as MIDIEvent);
    }

    const playPianoOn = (note: Note) => {
        const letter = midiToNoteMap.get(note.pitch)
        if (!letter) {
            return
        }
        setPlayedPianoNotes((prevNotes) => [...prevNotes, note.pitch]);
        console.log("tonePiano: " + tonePiano.loaded)
        console.log("letter: " + letter)
        tonePiano.keyDown({note: letter})
    };

    const playPianoStop = (note: Note) => {
        const letter = midiToNoteMap.get(note.pitch)
        setPlayedPianoNotes((prevNotes) => prevNotes.filter((n) => n !== note.pitch));
        tonePiano.keyUp({note: letter})
    };

    function play(note: Note) {
        const pitch = note.pitch;
        switch (note.on) {
            case 144:
                playPianoOn(note)
                // playSynthOn(pitch, calculateFrequency(pitch));
                setActiveNotes(prevState => {
                    return [...prevState, pitch]
                });
                break;
            case 128:
                playPianoStop(note)
                // playSynthOff(pitch, calculateFrequency(pitch));
                setActiveNotes(prevState => prevState.filter(note => note !== pitch));
                break;
        }
    }

    function calculateFrequency(pitch: number) {
        return Math.pow(2, ((pitch - 69) / 12)) * 440;
    }

    function playSynthOn(pitch: number, frequency: number) {
        const osc = new OscillatorNode(context);
        setOscillators(prevOscillators => ({
            ...prevOscillators,
            [frequency]: osc
        }));
        context.resume();
        osc.type = 'sawtooth';
        osc.frequency.value = frequency;
        osc.connect(context.destination);
        osc.start(context.currentTime);
        osc.stop(context.currentTime + 0.5);
    }

    function playSynthOff(pitch: number, frequency: number) {
        context.resume();
        const currentOscillator = oscillators[frequency];
        if (currentOscillator) {
            currentOscillator.stop(context.currentTime);
            currentOscillator.disconnect();
        }
    }

    function onMIDISuccess(midiData: MIDIAccess) {
        midi = midiData;
        const allInputs = midi.inputs.values();
        for (let input = allInputs.next(); input && !input.done; input = allInputs.next()) {
            input.value.onmidimessage = onMIDImessage;
        }
    }

    function onMIDIFailure() {
        console.log("No puede haber tiki tiki porque no se encontro un MIDI.");
    }

    return (
        <div className={"flex justify-center"}>
            {(isConnected && isSampleLoaded) ? (
                <div>
                    <ReactPiano
                        noteRange={{first: MidiNumbers.fromNote('c3'), last: MidiNumbers.fromNote('b4')}}
                        playNote={(midiNumber) => {
                        }}
                        stopNote={(midiNumber) => {
                        }}
                        width={1000}
                        activeNotes={activeNotes}
                    />
                </div>
            ) : (
                <div className={"mb-28"}>
                    <TryingToConnectIcon/>
                </div>
            )}
        </div>
    );
}

export default PianoPage;
