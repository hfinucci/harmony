import { IoAddCircleSharp } from "react-icons/io5";
import React, {useEffect, useRef, useState} from "react";
import "./AddBlock.css";
import {useForm} from "react-hook-form";
import {Block} from "../../types/dtos/Block";

export const AddBlock = ({x, y, submit, add, defaultBlock}: {
    x: number;
    y: number;
    submit: (block: Block, x:number, y:number) => void;
    add: (x:number, y:number) => void;
    defaultBlock?: Block
}) => {
    const [width, setWidth] = useState<number>(0)
    const [content, setContent] = useState(defaultBlock? defaultBlock.lyric : '');
    const span = useRef(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Block>();

    watch();

    const submitBlock =  async (data: any) => {
        console.log(data)
        console.log("submit")

        const name = "form" + x + "_" + y
        const form = document.forms[name]
        form.elements[1].blur()

        await submit(data, x, y)
    }

    function handleEnter(event) {
        if (event.key==="Enter") {
            const name = "form" + x + "_" + y
            const form = document.forms[name]
            if(event.target.id == "note") {
                form.elements[1].focus()
                event.preventDefault();
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
            <div className="flex">
                <form name={"form" + x + "_" + y} onSubmit={handleSubmit(submitBlock)} className={"flex flex-col gap-4 h-24 w-fit"}>
                    <input
                        autoFocus={defaultBlock == null}
                        id="note"
                        defaultValue={defaultBlock? defaultBlock.note : undefined}
                        {...register("note", {
                            required: true,
                            validate: { invalidNote },
                        })}
                        onKeyDown={handleEnter}
                        type="text"
                        className="rounded-lg bg-gray-300 border-0 w-10 px-2 focus:ring-0"></input>
                    <span id="hide" ref={span}>{content}</span>
                    <input
                        id="lyric"
                        defaultValue={defaultBlock? defaultBlock.lyric : undefined}
                        {...register("lyric", {
                            required: true
                        })}
                        onKeyDown={handleEnter}
                        type="text"
                        style={{ width: width + 25 }}
                        onChange={changeHandler}
                        className="rounded-lg border-0 w-full"/>
                    <input hidden type="submit"/>
                </form>

            </div>
        </div>
    )
}