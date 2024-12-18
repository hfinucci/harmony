import {useEffect, useRef, useState} from "react";
import "./AddBlock.css";
import {Block} from "../../types/dtos/Block";
import { RiDeleteBin5Fill } from "react-icons/ri";

export const AddBlock = ({rowIndex, blockIndex, submit, deleteBlock, defaultBlock, isLastBlock}: {
    rowIndex: number;
    blockIndex: number;
    deleteBlock: (rowIndex: number, blockIndex: number) =>void
    submit: (rowIndex: number, blockIndex: number, block: Block)=> void;
    defaultBlock: Block;
    isLastBlock: boolean;
}) => {
    const [width, setWidth] = useState<number>(0)
    const [content, setContent] = useState(defaultBlock.lyrics);
    const [noteError, setNoteError] = useState(false)
    const span = useRef(null);

    const submitBlock = (event) => {
        const name = "form" + rowIndex + "_" + blockIndex
        const form = document.forms[name]

        const valid = invalidNote(form.elements[0].value)
        if (!valid) {
            setNoteError(true)
            return
        }

        if (noteError)
            setNoteError(false)

        if (event.target.id == "note" && form.elements[1].value.length == 0) {
            return
        }

        submit(rowIndex, blockIndex, {
            chord: form.elements[0].value,
            lyrics: form.elements[1].value,
        });
    }

    function handleEnter(event) {
        const name = "form" + rowIndex + "_" + blockIndex
        const form = document.forms[name]
        if (event.key==="Enter") {
            if(event.target.id == "note") {
                form.elements[1].focus()
                event.preventDefault();
            } else if(event.target.id == "lyric") {
                form.elements[1].blur()
                event.preventDefault()
            }
        } else if(event.key !== "Backspace" && event.target.id == "note" && event.target.value.length >=3) {
            event.preventDefault()
        } else if(event.key == "Backspace" && event.target.id == "lyric" && event.target.value.length == 0) {
            form.elements[0].focus()
            event.preventDefault()
        }
    }

    useEffect(() => {
        if(span.current != null)
            setWidth(span.current.offsetWidth);
    }, [content]);

    const changeHandler = evt => {
        setContent(evt.target.value);
    };

    const invalidNote = (note: string) => {
        if (note.length === 0) return false;
        return !!String(note)
            .match(
                /^[A-G]([#b])?(m)?$/
            );
    };

    return (
        <div className="">
            <div className={noteError? "flex p-2 bg-red-200 rounded-lg" : "flex p-2"}>
                <form name={"form" + rowIndex + "_" + blockIndex} autoComplete="off" className={"flex flex-col gap-4 h-24 w-fit"}>
                    <div className="flex flex-row justify-between">
                        <input
                            id="note"
                            defaultValue={defaultBlock? defaultBlock.chord : undefined}
                            onKeyDown={handleEnter}
                            onBlur={submitBlock}
                            type="text"
                            className={noteError? "rounded-lg bg-gray-300 ring-1 border-1 ring-red-500 w-14 px-2 focus:ring-red-500" : "rounded-lg bg-gray-300 border-0 w-14 px-2 focus:ring-0"} />
                        {isLastBlock &&
                            <div className="opacity-0 hover:opacity-100 w-10 inline-flex items-top justify-end text-fuchsia-950 pr-2">
                                <RiDeleteBin5Fill className="cursor-pointer" onClick={() => deleteBlock(rowIndex, blockIndex)}/>
                            </div>
                        }
                    </div>
                    <span id="hide" ref={span}>{content}</span>
                    <input
                        id="lyric"
                        defaultValue={defaultBlock? defaultBlock.lyrics : undefined}
                        onKeyDown={handleEnter}
                        type="text"
                        style={{ width: width + 25 }}
                        onChange={changeHandler}
                        onBlur={submitBlock}
                        className="rounded-lg ring-1 ring-gray-300 w-full focus:ring-2 focus:ring-purple-300" />
                    <input hidden type="submit"/>
                </form>

            </div>
        </div>
    )
}