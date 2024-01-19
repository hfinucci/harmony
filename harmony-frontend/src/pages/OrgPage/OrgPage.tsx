import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import SongCard from "../../components/SongCard/SongCard";
import {OrgService} from "../../service/orgService";
import { FaMusic } from "react-icons/fa";
import CreateSongModal from "../../components/CreateSongModal/CreateSongModal";
import AddMemberModal from "../../components/AddMemberModal/AddMemberModal";

const OrgPage = () => {
    const [org, setOrg]: any = useState()
    const [members, setMembers]: any = useState()
    const [songs, setSongs]: any = useState()

    const orgId = useParams();

    useEffect(() => {
        OrgService.getOrg(orgId.id).then(async (rsp) => {
            if(rsp?.status == 200){
                const info = await rsp.json()
                setOrg(info)
            }
        })
    }, [])

    useEffect(() => {
        OrgService.getOrgMembers(orgId.id).then(async (rsp) => {
            if(rsp?.status == 200){
                const info = await rsp.json()
                setMembers(info)
            }
        })
    }, [org])

    useEffect(() => {
        OrgService.getOrgSongs(orgId.id).then(async (rsp) => {
            if(rsp?.status == 200){
                const info = await rsp.json()
                if (info.length > 0)
                    setSongs(info)
            }
        })
    }, [org])

    const addSong = (song: any) => {
        if (songs) {
            setSongs([...songs, song])
        } else {
            setSongs([song])
        }
    }

    return (
        <div>
            <div
                className="absolute z-1 bg-gradient-to-t from-black w-full h-96 bg-cover bg-center"/>
            <header
                className="w-full -mt-24 h-96 bg-[url('http://localhost:54321/storage/v1/object/sign/org-images/8323271.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJvcmctaW1hZ2VzLzgzMjMyNzEuanBnIiwiaWF0IjoxNzA1MDg4MzI3LCJleHAiOjE3MzY2MjQzMjd9.ZsSGXqbz1GiiPhxun0zXq4M69gm7L6LkmLDL7Q_qpwU&t=2024-01-12T19%3A38%3A47.152Z')] bg-cover bg-center flex justify-start items-end">
                <div className="flex flex-col">
                    {org  &&
                        <h1 className=" m-5 text-center text-5xl text-white drop-shadow-lg">
                            {org.name}
                        </h1>
                    }
                </div>
            </header>
            <div className="flex flex-row gap-4 my-10 justify-items-stretch ">
                <div className="basis-1/2 flex flex-col grow gap-2 ml-10">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                            <FaMusic className="text-2xl text-fuchsia-950"/>
                            <h1 className="text-2xl text-fuchsia-950 font-semibold">Canciones</h1>
                        </div>
                        <CreateSongModal org={orgId.id} callback={addSong}/>

                    </div>
                    {songs &&
                        <div className=" flex flex-col rounded-lg bg-white p-10">
                            <table className="table table-bordered border-separate border-spacing-y-1.5">
                                <thead>
                                <tr>
                                    <th className={"text-left text-gray-500"}>Nombre</th>
                                    <th className={"text-left text-gray-500"}>Fecha de Creación</th>
                                    <th className={"text-left text-gray-500"}>Fecha de Modificación</th>
                                    <th className={"text-left text-gray-500"}>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {songs.map((elem: any, index: number) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td colSpan={8} style={{backgroundColor: '#f0f0f0'}}/>
                                        </tr>
                                        <SongCard
                                            name={elem.name}
                                            creationDate={elem.created}
                                            lastModifiedDate={elem.lastmodified}/>
                                    </React.Fragment>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    }
                    {!songs &&
                        <div className="flex items-center justify-center p-4 md:p-5">
                            <h1 className="text-2xl text-fuchsia-950">
                                Oops! No tenes canciones
                            </h1>
                        </div>
                    }
                </div>
                <div className="flex flex-col shrink gap-2 mr-10 w-fit">
                    <h1 className="text-2xl text-fuchsia-950 font-semibold">Integrantes</h1>
                    <div className=" flex flex-col grow rounded-lg bg-white p-5 justify-between">
                        {members &&
                            <table className="table table-bordered border-separate border-spacing-y-1.5">
                                <tbody>
                                {members.map((elem: any, index: number) => (
                                    <React.Fragment key={index}>
                                        {elem.name}
                                        <tr>
                                            <td colSpan={8} style={{backgroundColor: '#f0f0f0'}}/>
                                        </tr>
                                    </React.Fragment>
                                ))}
                                </tbody>
                            </table>
                        }
                        {!members &&
                            <h1 className="text-2xl">No hay integrantes</h1>
                        }
                        <AddMemberModal org={orgId.id}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrgPage;