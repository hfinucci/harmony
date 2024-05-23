import React from "react";
import {Block} from "../../types/dtos/Block";


const PreviewSongComponent = ({blocks}: {blocks: Block[][]} | undefined) => {
    return (
        <div className="p-2 ml-72 mt-5 w-4/5 h-full bg-white">
            {blocks.map((block, index_l) => (
                <div key={index_l} className="flex flex-row flex-wrap">
                    {block.map((block, index_b) => (
                        <div key={index_l + "_" + index_b} className="flex gap-2">
                            <div className="flex flex-col gap-4 h-24 w-fit">
                                <p className="rounded-lg bg-gray-300 border-0 w-10 px-2 focus:ring-0">{block?.chord + " "}</p>
                                <p className="rounded-lg border-0 w-full pl-1">{block?.lyrics + " "}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
};

export default PreviewSongComponent;