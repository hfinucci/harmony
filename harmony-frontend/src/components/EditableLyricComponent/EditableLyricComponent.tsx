import React, {useState} from 'react';
import {AddBlock} from "../AddBlock/AddBlock";
import { IoAddCircleSharp } from "react-icons/io5";
import "./EditableLyricComponent.css"
import {Block} from "../../types/dtos/Block";

const EditableLyricsComponent = () => {
    const [blocks, setBlocks] = useState<Block[][]>([[]]);

    function handleUpdateBlock(rowIndex: number, blockIndex: number, block: Block) {
        const updatedBlocks = [...blocks];
        updatedBlocks[rowIndex][blockIndex] = block;
        setBlocks(updatedBlocks);
    }

    const handleAddBlockInRow = (rowIndex: number) => {
        if (blocks[rowIndex].length < 4) {
            const updatedBlocks = [...blocks];
            updatedBlocks[rowIndex] = [...updatedBlocks[rowIndex], { note: '', lyric: '' }];
            setBlocks(updatedBlocks);
        }
    }

    const handleAddBlockNewRow = () => {
        setBlocks([...blocks, [{ note: '', lyric: '' }]]);
    };

    function handleDeleteBlock(rowIndex: number, blockIndex: number) {
        const updatedBlocks = [...blocks];
        updatedBlocks[rowIndex].splice(blockIndex, 1);
        setBlocks(updatedBlocks);
    }

    const submit = () => {
        // Handle submission of blocks, for example, send to server or process locally
        console.log(blocks);
    };

    return (
        <div>
            {blocks.map((row, rowIndex) => (
                <div key={rowIndex} className="block flex flex-row flex-wrap" style={{ position: 'relative' }}>
                    {row.map((block, blockIndex) => (
                        <div key={blockIndex}>
                            <AddBlock key={rowIndex + "_" + blockIndex + "_" + block.note + "_" + block.lyric } rowIndex={rowIndex} blockIndex={blockIndex} submit={handleUpdateBlock}
                                      defaultBlock={block} deleteBlock={handleDeleteBlock}/>
                        </div>
                    ))}
                    {blocks[rowIndex].length < 4 && (
                        <button onClick={() => handleAddBlockInRow(rowIndex)}
                                className="flex justify-center items-center border-gray-200 text-gray-200 h-24 w-20 border-2 border-dashed rounded-lg hover:border-fuchsia-300 hover:text-fuchsia-300">
                            <IoAddCircleSharp className="h-10 w-10"/>
                        </button>
                    )}
                </div>
            ))}
            <button onClick={handleAddBlockNewRow}
                    className="p-4 flex justify-center items-center border-gray-200 text-gray-200 h-24 w-full border-2 border-dashed rounded-lg hover:border-fuchsia-300 hover:text-fuchsia-300">
                <IoAddCircleSharp className="h-10 w-10"/>
            </button>
            <button onClick={submit}>submit</button>
        </div>
    );
};

export default EditableLyricsComponent;
