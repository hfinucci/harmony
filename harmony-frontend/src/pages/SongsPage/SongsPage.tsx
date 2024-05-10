import React, {useEffect, useState} from "react";
import SongCard from "../../components/SongCard/SongCard.tsx";
import {UserService} from "../../service/userService.ts";

export interface Song {
    id: number;
    name: string;
    org?: string;
    created: string;
    lastmodified: string;
}

const SongsPage = () => {

    const [songs, setSongs] = useState<Song[]>([]);

    const fetchSongs = async () => {
        await UserService.getSongsByUserId(Number(localStorage.getItem('harmony-uid')))
            .then((response: Song[]) => {
                setSongs(response);
            })
    }

    useEffect(() => {
        const fetch = async () => {
            await fetchSongs();
        }
        fetch();
    }, []);

    return (

        <div className="container h-screen mt-16 mx-auto max-w-12xl">
            <h1 className="text-fuchsia-950 text-4xl mb-4">Canciones en tus organizaciones</h1>
            <div className="flex flex-col rounded-lg bg-white p-10">
                {songs.length !== 0 ? (
                    <table className="table table-bordered border-separate border-spacing-y-1.5">
                        <thead>
                        <tr>
                            <th className={"text-left text-gray-500"}>Nombre</th>
                            <th className={"text-left text-gray-500"}>Organización</th>
                            <th className={"text-left text-gray-500"}>Fecha de Creación</th>
                            <th className={"text-left text-gray-500"}>Fecha de Modificación</th>
                            <th className={"text-left text-gray-500"}>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {songs.map((elem: Song, index: number) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td colSpan={8} style={{backgroundColor: '#f0f0f0'}}/>
                                </tr>
                                <SongCard
                                    song={elem}
                                    fetchSongs={fetchSongs}
                                />
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    songs.length == 0 &&
                    <div className="flex items-center justify-center p-4 md:p-5">
                        <h1 className="text-2xl text-fuchsia-950">
                            Oops! No tenes canciones
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SongsPage;