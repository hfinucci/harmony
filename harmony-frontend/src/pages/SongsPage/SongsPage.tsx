import React, {useEffect, useState} from "react";
import SongCard from "../../components/SongCard/SongCard.tsx";
import {UserService} from "../../service/userService.ts";

export interface Song {
    name: string;
    organization: string;
    creationDate: string;
    lastModifiedDate: string;
}

const SongsPage = () => {

    const [songs, setSongs] = useState<Song[]>([]);

    let elements: any = [
        {
            name: "Stairway to Heaven",
            organization: "Led Zeppelin",
            creationDate: "1971-11-08",
            lastModifiedDate: new Date().toISOString()
        },
        {
            name: "Black Dog",
            organization: "Led Zeppelin",
            creationDate: "1980-12-18",
            lastModifiedDate: new Date().toISOString()
        },
        {
            name: "The Rain Song",
            organization: "Led Zeppelin",
            creationDate: "1980-12-18",
            lastModifiedDate: new Date().toISOString()
        },
        {
            name: "Whole Lotta Love",
            organization: "Led Zeppelin",
            creationDate: "1980-12-18",
            lastModifiedDate: new Date().toISOString()
        }
    ];

    useEffect(() => {
        (async () => {
            await UserService.getSongsByUserId(1)
                .then((response: Song[]) => {
                    setSongs(response);
                })
        })();
    }, []);

    return (

        <div className="container h-screen mt-16 mx-auto max-w-12xl">
            <h1 className="text-fuchsia-950 text-4xl mb-4">Canciones en tus organizaciones</h1>
            <div className="flex flex-col rounded-lg bg-white p-10">
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
                    {elements.map((elem: any, index: number) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td colSpan={8} style={{backgroundColor: '#f0f0f0'}}/>
                            </tr>
                            <SongCard
                                name={elem.name}
                                organization={elem.organization}
                                creationDate={elem.creationDate}
                                lastModifiedDate={elem.lastModifiedDate}/>
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SongsPage;