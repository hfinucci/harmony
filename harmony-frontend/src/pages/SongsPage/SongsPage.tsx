import React, {useEffect, useState} from "react";
import SongCard from "../../components/SongCard/SongCard.tsx";
import {SongService} from "../../service/songService.ts";

export interface Song {
    song: string;
    org?: string;
    created: string;
    lastmodified: string;
}

const SongsPage = () => {

    const [songs, setSongs] = useState<Song[]>();

    useEffect(() => {
        SongService.getSongsByUser(49).then(async (rsp) => {
            if(rsp?.status == 200) {
                const info = await rsp.json()
                setSongs(info)
            }
        })
    }, [])

    return (

        <div className="container h-screen mt-16 mx-auto max-w-12xl">
            <h1 className="text-fuchsia-950 text-4xl mb-4">Canciones en tus organizaciones</h1>
            <div className="flex flex-col rounded-lg bg-white p-10">
                {songs &&
                <table className="table table-bordered border-separate border-spacing-y-1.5">
                    <thead>
                    <tr>
                        <th className={"text-left text-gray-500"}>Nombre</th>
                        <th className={"text-left text-gray-500"}>Organización</th>
                        <th className={"text-left text-gray-500"}>Fecha de Creación</th>
                        <th className={"text-left text-gray-500"}>Fecha de Modificación</th>
                    </tr>
                    </thead>
                    <tbody>
                    {songs.map((elem: any, index: number) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td colSpan={8} style={{backgroundColor: '#f0f0f0'}}/>
                            </tr>
                            <SongCard
                                song={elem.song}
                                org={elem.org}
                                created={elem.created}
                                lastmodified={elem.lastmodified}/>
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
                }
            </div>
        </div>
    );
};

export default SongsPage;