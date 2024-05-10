import React from "react";


const PreviewSongComponent = ({blocks}) => {
    return (
        <div className="p-2 ml-72 mt-5 w-4/5 h-full bg-white">
            {blocks.map((lines, index_l) => (
                <div key={index_l} className="flex flex-row flex-wrap">
                    {lines.map((block, index_b) => (
                        <div key={index_l + "_" + index_b} className="flex gap-2">
                            <div className="flex flex-col gap-4 h-24 w-fit">
                                <p className="rounded-lg bg-gray-300 border-0 w-10 px-2 focus:ring-0">{block?.note + " "}</p>
                                <p className="rounded-lg border-0 w-full pl-1">{block?.lyric + " "}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
};

export default PreviewSongComponent;