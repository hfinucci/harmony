import React, {useEffect, useState} from "react";
import {Song} from "../SongsPage/SongsPage";
import {Org} from "../../types/dtos/Org";
import {OrgService} from "../../service/orgService";
import {Link, useNavigate, useParams} from "react-router-dom";
import {SongService} from "../../service/songService";
import {IoAddCircleSharp, IoPeopleSharp} from "react-icons/io5";
import CreateSongModal from "../../components/CreateSongModal/CreateSongModal";
import {FaMusic} from "react-icons/fa";
import {CgExport} from "react-icons/cg";
import {useTranslation} from "react-i18next";
import {Block} from "../../types/dtos/Block";
import PreviewSongComponent from "../../components/PreviewSongComponent/PreviewSongComponent";
import {AddBlock} from "../../components/AddBlock/AddBlock";
import PianoPage from "../PianoPage/PianoPage.tsx";
import {BlockService} from "../../service/blockService";
import {socket} from "../../socket.ts";
import {useInterval} from "../../utils";
import {Contributors} from "../../types/dtos/Contributors";
import 'flowbite';
import 'flowbite/dist/flowbite.css'
import "./EditPage.css"


const EditPage = () => {
    const [song, setSong] = useState<Song>();
    const [songs, setSongs] = useState<Song[]>([]);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [org, setOrg] = useState<Org>();
    const [view, setView] = useState<number>(1)
    const [piano, setPiano] = useState<boolean>(false)
    const [contributors, setContributors] = useState<Contributors[]>(null)

    const [blocks, setBlocks] = useState<Block[][]>()

    const songId = useParams();

    const nav = useNavigate();

    const {t} = useTranslation();

    useEffect(() => {
        SongService.getSongById(Number(songId.id)).then(async (rsp) => {
            if (rsp?.status == 200) {
                rsp.json().then((response: Song) => {
                    setSong(response);
                    socket.emit("contributors", response.composeid)
                    BlockService.getSongBlocksById(response.composeid).then(async (rsp) => {
                        if (rsp?.status == 200) {
                            rsp.json().then((response: Block[][]) => {
                                setBlocks(response)
                            })
                        }

                    })
                })
            }
        });
    }, [songId]);

    useEffect(() => {
        if (song != undefined) {
            OrgService.getOrg(Number(song?.org)).then(async (rsp) => {
                if (rsp?.status == 200) {
                    const info = await rsp.json();
                    setOrg(info);
                }
            });
            OrgService.getOrgSongs(Number(song?.org)).then(async (rsp) => {
                if (rsp?.status == 200) {
                    const info = await rsp.json();
                    setSongs(info);
                }
            });
        }
    }, [song]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
            console.log("connected")
        }

        function onDisconnect() {
            setIsConnected(false);
            console.log("disconnected")
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('compose', gotComposeResponse);
        socket.on('contributors', gotContributorsResponse);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, [socket]);

    useInterval( () => {
        socket.emit('contributors', song?.composeid)
    }, 10000)

    function gotComposeResponse(data: any) {
        const json : Block[][] = JSON.parse(data)["message"]
        setBlocks(json)
    }

    function gotContributorsResponse(data: any) {
        const conts = data.contributors as Contributors[]
        setContributors(conts)
    }

    const navToSong = (song: Song) => {
        nav("/songs/" + song.id);
    };

    const togglePiano = () => {
        setPiano(!piano);
    }

    function handleUpdateBlock(rowIndex: number, blockIndex: number, block: Block) {
        const body = {
            operation: "editBlock",
            songId: song?.composeid,
            userId: Number(localStorage.getItem("harmony-uid")),
            row: rowIndex,
            col: blockIndex,
            lyrics: block.lyrics,
            chord: block.chord
        }
        socket.emit('compose', JSON.stringify(body))
    }

    const handleAddBlockInRow = async (rowIndex: number) => {
        const body = {
            operation: "appendBlock",
            songId: song?.composeid,
            userId: Number(localStorage.getItem("harmony-uid")),
            row: rowIndex,
            lyrics: "",
            chord: ""
        }
        socket.emit('compose', JSON.stringify(body))
        if (!(blocks) || blocks[rowIndex].length < 4) {
            const updatedBlocks = [...blocks];
            updatedBlocks[rowIndex] = [...updatedBlocks[rowIndex], {note: '', lyric: ''}];
            setBlocks(updatedBlocks);
        }
    }

    const handleAddBlockNewRow = () => {
        const body = {
            operation: "appendRow",
            songId: song?.composeid,
            userId: Number(localStorage.getItem("harmony-uid")),
            lyrics: "",
            chord: ""
        }
        socket.emit('compose', JSON.stringify(body))
        setBlocks([...blocks, [{note: '', lyric: ''}]]);
    };

    function handleDeleteBlock(rowIndex: number, blockIndex: number) {
        const updatedBlocks = [...blocks];
        updatedBlocks[rowIndex].splice(blockIndex, 1);
        if (updatedBlocks[rowIndex].length === 0) {
            updatedBlocks.splice(rowIndex, 1);
        }
        setBlocks(updatedBlocks);
    }

    const submit = () => {
        // Handle submission of blocks, for example, send to server or process locally
    };

    return (
        <div className="container h-screen">
            <aside id="sidebar-multi-level-sidebar"
                   className="fixed top-0 left-0 z-0 w-64 h-full pt-20 transition-transform bg-white -translate-x-full translate-x-0"
                   aria-label="Sidebar">
                <div className="flex flex-col justify-between h-full py-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        {org &&
                            <li>
                                <div
                                    className="flex text-fuchsia-950 w-full text-lg items-center p-2 group">
                                    <IoPeopleSharp/>
                                    <h1 className="ms-3">{org.name}</h1>
                                </div>
                                {songs &&
                                    <ul id="songs" className="py-2 divide-y">
                                        {songs.map((song, index) => (
                                            <li key={index}>
                                                <Link to={"/songs/" + song.id}
                                                      className={song.id == songId.id ? "flex items-center w-full h-full p-3 text-fuchsia-950 bg-fuchsia-50 transition text-sm duration-75 pl-11 group" : "flex items-center w-full p-3 text-gray-900 transition text-sm duration-75 pl-11 group hover:bg-gray-100"}>{song.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                }
                            </li>
                        }
                    </ul>
                    <CreateSongModal callback={navToSong}/>
                </div>
            </aside>
            {song &&
                <div key={songId} className="h-full">
                    <p className="ml-72 py-5 text-4xl text-fuchsia-800">{song?.name}</p>
                    <div className="ml-72 flex justify-between items-center">
                        <ul className=" text-sm font-medium text-center text-fuchsia-500 w-1/2 rounded-lg shadow sm:flex">
                            <li className="w-full focus-within:z-10">
                                <button onClick={() => setView(1)}
                                        className={view == 1 ? "inline-block w-full p-4 text-fuchsia-900 border-r border-fuchsia-200 bg-fuchsia-300"
                                            : "inline-block w-full p-4 text-fuchsia-900 border-r border-fuchsia-200 bg-fuchsia-100 hover:bg-fuchsia-300"}
                                >{t("pages.edit.view.edit")}</button>
                            </li>
                            <li className="w-full focus-within:z-10">
                                <button onClick={() => setView(2)}
                                        className={view == 2 ? "inline-block w-full p-4 text-fuchsia-900 border-r border-fuchsia-200 bg-fuchsia-300"
                                            : "inline-block w-full p-4 text-fuchsia-900 bg-fuchsia-100 border-r border-fuchsia-200 hover:bg-fuchsia-300"}
                                >{t("pages.edit.view.preview")}</button>
                            </li>
                        </ul>
                        <div className="flex -space-x-4 rtl:space-x-reverse">
                            {contributors && contributors.map((contributor, index) => {
                                if(contributor.id != localStorage.getItem("harmony-uid") as number)
                                    return <div key={index} className="group flex justify-center">
                                        <div
                                            className="absolute mt-12 z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100">
                                            {contributor.name}
                                        </div>
                                        <img data-tooltip-target={"tooltip-" + contributor.id} className="w-10 h-10 rounded-full ring-2 ring-fuchsia-900"
                                             src={contributor.image} alt="Medium avatar" />
                                    </div>
                            })}
                            <div key={0} className="group flex justify-center">
                                <div
                                    className="absolute mt-12 z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100">
                                    {t("pages.edit.me")}
                                </div>
                                <img className="w-10 h-10 rounded-full ring-2 ring-fuchsia-900"
                                     src={localStorage.getItem("harmony-profile-image")} alt="Medium avatar" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {piano &&
                                <button onClick={togglePiano}
                                        className="flex text-xl text-fuchsia-950 rounded-full bg-fuchsia-300 h-10 w-10 justify-center items-center hover:bg-fuchsia-300">
                                    <FaMusic/></button>
                            }
                            {!piano &&
                                <button onClick={togglePiano}
                                        className="flex text-xl text-fuchsia-950 rounded-full bg-fuchsia-100 h-10 w-10 justify-center items-center hover:bg-fuchsia-300">
                                    <FaMusic/></button>
                            }
                            <button
                                className="flex text-xl text-fuchsia-950 rounded-full bg-fuchsia-100 h-10 w-10 justify-center items-center hover:bg-fuchsia-300">
                                <CgExport/>
                            </button>
                        </div>
                    </div>
                    {view == 1 &&
                        <div className="p-2 ml-72 mt-5 w-4/5 h-full bg-white">
                            <div>
                                {blocks && blocks.map((row, rowIndex) => (
                                    <div key={rowIndex} className="block flex flex-row flex-wrap"
                                         style={{position: 'relative'}}>
                                        {row.map((block: Block, blockIndex) => (
                                            <div key={blockIndex}>
                                                <AddBlock
                                                    key={rowIndex + "_" + blockIndex + "_" + block.chord + "_" + block.lyrics}
                                                    rowIndex={rowIndex}
                                                    blockIndex={blockIndex}
                                                    submit={handleUpdateBlock}
                                                    defaultBlock={block}
                                                    deleteBlock={handleDeleteBlock}/>
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
                                <button onClick={submit} className="hidden">submit</button>
                            </div>
                            <div className={"h-fit fixed inset-x-0 bottom-0 flex justify-center mb-4"}>
                                {piano && <PianoPage enabled={piano} song={song}/>}
                            </div>
                        </div>
                    }
                    {view == 2 &&
                        <PreviewSongComponent blocks={blocks}/>
                    }
                </div>
            }
        </div>
    )
}

export default EditPage;
