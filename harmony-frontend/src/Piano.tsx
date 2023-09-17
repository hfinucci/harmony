import { useEffect, useState } from 'react';
import { pitch } from './notes';
import { white_notes } from './notes';
import { black_notes } from './notes';

export function Piano(colorId: {colorId: number}) {

    const colors = ["bg-white", "bg-black","bg-blue-500", "bg-green-500", "bg-red-500"]

    const [keyStates, setKeyStates] = useState([0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0]);

    // Depends on the color the backend selects for the specific client.
    const [myKeyColor, setMyKeyColor] = useState(3);

    useEffect(() => {
        setMyKeyColor(colorId.colorId)
    }, [colorId])

    function handleClick(note: string) {
        const newKeyStates = [...keyStates]
        if (newKeyStates[pitch.indexOf(note)] !== myKeyColor) {
            newKeyStates[pitch.indexOf(note)] = myKeyColor
        } else {
            newKeyStates[pitch.indexOf(note)] = white_notes.includes(note) ? 0 : 1
        }
        setKeyStates(newKeyStates)
    }

    function getKeyColor(note: string): string {
        return colors[keyStates[pitch.indexOf(note)]]
    }

    const blackNotes = black_notes.map((note) =>
        <div className={`text-red-500 h-32 w-10 ml-4 mr-4 ${getKeyColor(note)} m-2`} onMouseDown={() => handleClick(note)} onMouseUp={() => handleClick(note)}>{note}</div>
    );

    const whiteNotes = white_notes.map((note) =>
        <div className={`text-red-500 h-32 w-10 ${getKeyColor(note)} m-2`} onMouseDown={() => handleClick(note)} onMouseUp={() => handleClick(note)}>{note}</div>
    );

    return (
        <div className={"h-screen flex items-center justify-center bg-gray-500"}>
            <div className="grid-rows-2">
                <div className="flex justify-center">
                    {blackNotes}
                </div>
                <div className="flex">
                    {whiteNotes}
                </div>
            </div>
        </div>

    )
}