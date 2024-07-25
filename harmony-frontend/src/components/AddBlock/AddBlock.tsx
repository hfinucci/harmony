import React, {useEffect, useRef, useState} from "react";
import "./AddBlock.css";
import {useForm} from "react-hook-form";
import {Block} from "../../types/dtos/Block";
import { RiDeleteBin5Fill } from "react-icons/ri";

export const AddBlock = ({rowIndex, blockIndex, submit, deleteBlock, defaultBlock}: {
    rowIndex: number;
    blockIndex: number;
    deleteBlock: (rowIndex: number, blockIndex: number) =>void
    submit: (rowIndex: number, blockIndex: number, block: Block)=> void;
    defaultBlock: Block
}) => {
    const [width, setWidth] = useState<number>(0)
    const [content, setContent] = useState(defaultBlock.lyrics);
    const span = useRef(null);

    const {
        register,
        watch,
    } = useForm<Block>();

    watch();

    const submitBlock = () => {
        const name = "form" + rowIndex + "_" + blockIndex
        const form = document.forms[name]
        submit(rowIndex, blockIndex, {chord: form.elements[0].value, lyrics: form.elements[1].value})
    }

    function handleEnter(event) {
        if (event.key==="Enter") {
            const name = "form" + rowIndex + "_" + blockIndex
            const form = document.forms[name]
            if(event.target.id == "note") {
                form.elements[1].focus()
                event.preventDefault();
            } else if(event.target.id == "lyric") {
                form.elements[1].blur()
                event.preventDefault()
            }
        } else if(event.key !== "Backspace" && event.target.id == "note" && event.target.value.length >=2) {
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
                /([A-G])([#b])?/
            );
    };

    return (
        <div className="">
            <div className="flex p-2">
                <form name={"form" + rowIndex + "_" + blockIndex} autoComplete="off" className={"flex flex-col gap-4 h-24 w-fit"}>
                    <div className="flex flex-row justify-between">
                        <input
                            autoFocus={defaultBlock.chord == '' && defaultBlock.lyrics == '' }
                            id="note"
                            defaultValue={defaultBlock? defaultBlock.chord : undefined}
                            {...register("chord", {
                                required: true,
                                validate: { invalidNote },
                            })}
                            onKeyDown={handleEnter}
                            type="text"
                            className="rounded-lg bg-gray-300 border-0 w-10 px-2 focus:ring-0" />
                        <div className="opacity-0 hover:opacity-100 w-10 inline-flex items-top justify-end text-fuchsia-950 pr-2">
                            <RiDeleteBin5Fill className="cursor-pointer" onClick={() => deleteBlock(rowIndex, blockIndex)}/>
                        </div>
                    </div>
                    <span id="hide" ref={span}>{content}</span>
                    <input
                        id="lyric"
                        defaultValue={defaultBlock? defaultBlock.lyrics : undefined}
                        {...register("lyrics", {
                            required: true
                        })}
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