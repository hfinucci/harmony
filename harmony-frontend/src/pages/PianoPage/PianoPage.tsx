import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket.ts";
import { KeyboardShortcuts, MidiNumbers, Piano as ReactPiano } from "react-piano";
import 'react-piano/dist/styles.css';
import TryingToConnectIcon from "../../components/TryingToConnect/TryingToConnectIcon.tsx";
import { Piano } from "@tonejs/piano/build/piano/Piano";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMusic, faVolumeUp} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";

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
    [41, "F2"],
    [42, "F#2"],
    [43, "G2"],
    [44, "G#2"],
    [45, "A2"],
    [46, "A#2"],
    [47, "B2"],
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
    [71, "B4"],
    [72, "C5"],
    [73, "C#5"],
    [74, "D5"],
    [75, "D#5"],
    [76, "E5"],
    [77, "F5"],
    [78, "F#5"],
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
    const [transposeOffset, setTransposeOffset] = useState<number>(0)
    const transposeOffsetRef = useRef(transposeOffset);
    const [bpm, setBpm] = useState(60);  // Initial BPM for the metronome
    const [volume, setVolume] = useState(50);  // Initial volume for the metronome
    const [isMetronomeOn, setIsMetronomeOn] = useState(false);
    const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const MAX_TRANSPOSE_OFFSET = 7
    const MIN_TRANSPOSE_OFFSET = -7
    let midi: MIDIAccess | undefined;
    let tonePiano: Piano

    const {t} = useTranslation();

    useEffect(() => {
        transposeOffsetRef.current = transposeOffset;
    }, [transposeOffset]);

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

    useEffect(() => {
        if (isMetronomeOn) {
            const interval = 60000 / bpm;
            metronomeIntervalRef.current = setInterval(() => {
                playMetronomeClick();
            }, interval);
        } else {
            if (metronomeIntervalRef.current) {
                clearInterval(metronomeIntervalRef.current);
                metronomeIntervalRef.current = null;
            }
        }

        return () => {
            if (metronomeIntervalRef.current) {
                clearInterval(metronomeIntervalRef.current);
            }
        };
    }, [bpm, isMetronomeOn]);

    function gotExternalMidiMessage(data: MIDIEvent) {
        play(data.note)
    }

    function onMIDImessage(messageData: MIDIMessageEvent) {
        const note: Note = {
            on: messageData.data[0],
            pitch: messageData.data[1] + transposeOffsetRef.current,
            velocity: messageData.data[2]
        }
        // No toco la nota si es local. Solo suenan las notas que vienen del servidor.
        play(note);
        const userId = Number(localStorage.getItem("harmony-uid"))
        socket.emit('clientMidi', {composeId: song.composeid, userId: userId, note: note} as MIDIEvent);
    }

    const playPianoOn = (note: Note) => {
        const pitch = note.pitch
        const letter = midiToNoteMap.get(pitch)
        if (!letter) {
            return
        }
        setPlayedPianoNotes((prevNotes) => [...prevNotes, pitch]);
        tonePiano.keyDown({note: letter})
    };

    const playPianoStop = (note: Note) => {
        const pitch = note.pitch
        const letter = midiToNoteMap.get(pitch)
        setPlayedPianoNotes((prevNotes) => prevNotes.filter((n) => n !== pitch));
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

    const handleTransposeOffset = (offset: number) => {
        if (offset > 0 && transposeOffset < MAX_TRANSPOSE_OFFSET
            || offset < 0 && transposeOffset > MIN_TRANSPOSE_OFFSET) {
            setTransposeOffset((prevOffset) => prevOffset + offset)
        }
    }

    const handleBpmChange = (event) => {
        setBpm(Number(event.target.value));
    }

    const handleVolumeChange = (event) => {
        setVolume(Number(event.target.value));
    }

    const toggleMetronome = () => {
        setIsMetronomeOn(!isMetronomeOn);
    }

    const playMetronomeClick = () => {
        const osc = new OscillatorNode(context);
        const gainNode = context.createGain();
        gainNode.gain.value = volume / 100;
        osc.connect(gainNode);
        gainNode.connect(context.destination);
        context.resume();
        osc.type = 'square';
        osc.frequency.value = 1000;
        osc.start();
        osc.stop(context.currentTime + 0.1);
    }

    return (
        <div className={"flex justify-center"}>
            {(isConnected && isSampleLoaded) ? (
                <div className={"flex justify-center bg-purple-300 pl-2 pr-2 rounded-lg"}>
                    <div className={"flex flex-col items-center mt-4 pr-2"}>
                        <label className="text-xl font-bold">BPM: {bpm}</label>
                        <div className="flex items-center mt-2 space-x-2">
                            <FontAwesomeIcon icon={faMusic} />
                            <input
                                type="range"
                                min="40"
                                max="200"
                                value={bpm}
                                onChange={handleBpmChange}
                                className="w-64 h-2 bg-gray-200 rounded-lg accent-purple-500 cursor-pointer"
                            />
                        </div>
                        <label className="text-xl font-bold mt-4">Volume: {volume}</label>
                        <div className="flex items-center mt-2 space-x-2 mb-4">
                            <FontAwesomeIcon icon={faVolumeUp} />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-64 h-2 bg-gray-200 rounded-lg accent-purple-500 cursor-pointer"
                            />
                        </div>
                        <button
                            onClick={toggleMetronome}
                            className="px-4 py-2 mt-2 bg-purple-500 text-white font-bold rounded hover:bg-purple-700"
                        >
                            {isMetronomeOn ? t("piano.metronome.stop") : t('piano.metronome.start')}
                        </button>
                    </div>
                    <ReactPiano
                        noteRange={{first: MidiNumbers.fromNote('c3'), last: MidiNumbers.fromNote('b4')}}
                        playNote={(midiNumber) => {
                        }}
                        stopNote={(midiNumber) => {
                        }}
                        width={1000}
                        activeNotes={activeNotes}
                    />
                    <div className={"flex flex-col items-center mb-8 justify-center space-x-4 mt-4 pl-2"}>
                        <div className={"flex flex-col items-center"}>
                            <button
                                onClick={() => handleTransposeOffset(-1)}
                                className="px-4 py-2 bg-purple-500 font-bold text-white rounded hover:bg-purple-700"
                            >-
                            </button>
                            <h1 className="text-2xl font-bold">{transposeOffset}</h1>
                            <button
                                onClick={() => handleTransposeOffset(1)}
                                className="px-4 ml-0.5 py-2 bg-purple-500 text-white font-bold rounded hover:bg-purple-700"
                            > +
                            </button>
                        </div>
                    </div>
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
