import React, {useEffect, useState} from "react";
import {Song} from "../SongsPage/SongsPage";
import {Org} from "../../types/dtos/Org";
import {OrgService} from "../../service/orgService";
import { useParams, useNavigate } from "react-router-dom";
import {SongService} from "../../service/songService";
import { IoPeopleSharp } from "react-icons/io5";
import CreateSongModal from "../../components/CreateSongModal/CreateSongModal";
import { FaRegHeart } from "react-icons/fa";
import { CgExport } from "react-icons/cg";
import { FaHeart } from "react-icons/fa";
import {useTranslation} from "react-i18next";
import {Block} from "../../types/dtos/Block";
import {AddBlock} from "../../components/AddBlock/AddBlock";
import { IoAddCircleSharp } from "react-icons/io5";


const EditPage = () => {
    const [song, setSong] = useState<Song>();
    const [songs, setSongs] = useState<Song[]>([]);
    const [org, setOrg] = useState<Org>();

    const [view, setView] = useState<number>(1)
    const [like, setLike] = useState<boolean>(false)

    const [blocks, setBlocks] = useState<Block[][]>([[{note:"A#", lyric:"Hello"}]])

    const songId = useParams();

    const nav = useNavigate();

    const { t } = useTranslation();

    useEffect(() => {
        SongService.getSongById(Number(songId.id)).then(async (rsp) => {
            if (rsp?.status == 200) {
                rsp.json().then((response: Song) => {
                    setSong(response);
                })
            }
        });
    }, []);

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



    const navToSong = (song: Song) => {
        nav("/songs/" + song.id);
    };

    async function addLine() {
        setBlocks([...blocks, [null]]);
        await console.log(blocks)
    }

    function addEmptyBlock(x, y) {
        console.log("X", x)
        console.log("Y", y)

        let copy = [...blocks];
        copy[x][y] = null;
        setBlocks(copy);
        console.log(blocks)
    }

    function addBlock(block: Block, x:number, y:number){
        let copy = [...blocks];
        copy[x][y] = block;
        setBlocks(copy);
        console.log("addBlock")
        console.log(blocks)
    }

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
                                    <IoPeopleSharp />
                                    <h1 className="ms-3">{org.name}</h1>
                                </div>
                                {songs &&
                                    <ul id="songs" className="py-2 divide-y">
                                        {songs.map((song, index) => (
                                            <li key={index}>
                                                <a href={"/songs/" + song.id}
                                                   className={song.id == songId.id ? "flex items-center w-full h-full p-3 text-fuchsia-950 bg-fuchsia-50 transition text-sm duration-75 pl-11 group" : "flex items-center w-full p-3 text-gray-900 transition text-sm duration-75 pl-11 group hover:bg-gray-100"}>{song.name}</a>
                                            </li>
                                        ))}
                                    </ul>
                                }
                            </li>
                        }
                    </ul>
                    <CreateSongModal callback={navToSong} />
                </div>
            </aside>
            {song &&
                <p className="ml-72 py-5 text-4xl text-fuchsia-800">{song?.name}</p>
            }
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
                <div className="flex items-center space-x-3">
                    {like &&
                        <button onClick={() => setLike(false)} className="flex text-xl text-fuchsia-950 rounded-full bg-fuchsia-100 h-10 w-10 justify-center items-center hover:bg-fuchsia-300"><FaHeart /></button>
                    }
                    {!like &&
                        <button onClick={() => setLike(true)} className="flex text-xl text-fuchsia-950 rounded-full bg-fuchsia-100 h-10 w-10 justify-center items-center hover:bg-fuchsia-300"><FaRegHeart /></button>
                    }
                    <button className="flex text-xl text-fuchsia-950 rounded-full bg-fuchsia-100 h-10 w-10 justify-center items-center hover:bg-fuchsia-300"><CgExport /></button>
                </div>
            </div>
            <div className="p-2 ml-72 mt-5 w-4/5 h-full bg-white">
                {blocks.map((lines, index_l) => (
                    <div key={index_l} className="flex flex-row flex-wrap">
                        {lines.map((block, index_b) => (
                            <div key={index_l + "_" + index_b}>
                                <AddBlock x={index_l} y={index_b} submit={addBlock} add={addEmptyBlock} defaultBlock={block}/>
                            </div>
                        ))}
                        {lines.length < 4 &&
                            <button onClick={() => addEmptyBlock(index_l, lines.length)}
                                    className="flex justify-center items-center border-gray-200 text-gray-200 h-24 w-20 border-2 border-dashed rounded-lg hover:border-fuchsia-300 hover:text-fuchsia-300">
                                <IoAddCircleSharp className="h-10 w-10"/>
                            </button>
                        }
                    </div>
                ))}
                <button onClick={addLine} className="p-4 flex justify-center items-center border-gray-200 text-gray-200 h-24 w-full border-2 border-dashed rounded-lg hover:border-fuchsia-300 hover:text-fuchsia-300">
                    <IoAddCircleSharp className="h-10 w-10"/>
                </button>
            </div>
        </div>
    )
}

export default EditPage;
