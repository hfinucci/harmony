import React, {useEffect, useState} from "react";
import {Song, SongPagination} from "../../types/dtos/Song";
import {Org} from "../../types/dtos/Org";
import {OrgService} from "../../service/orgService";
import {Link, useNavigate, useParams} from "react-router-dom";
import {SongService} from "../../service/songService";
import {IoAddCircleSharp, IoInformationCircleSharp, IoPeopleSharp} from "react-icons/io5";
import CreateSongModal from "../../components/CreateSongModal/CreateSongModal";
import { CgExport, CgPiano } from "react-icons/cg";
import {useTranslation} from "react-i18next";
import {Block} from "../../types/dtos/Block";
import PreviewSongComponent from "../../components/PreviewSongComponent/PreviewSongComponent";
import {AddBlock} from "../../components/AddBlock/AddBlock";
import PianoPage from "../PianoPage/PianoPage.tsx";
import {BlockService} from "../../service/blockService";
import {socket} from "../../socket.ts";
import {PROFILE_IMAGES_PATH, useInterval} from "../../utils";
import {Contributors} from "../../types/dtos/Contributors";
import "./EditPage.css"
import ErrorPage from "../ErrorPage/ErrorPage.tsx";
import {Document, Page, PDFDownloadLink, StyleSheet, Text, View} from '@react-pdf/renderer'
import Tooltip from "../../components/Tooltip/Tooltip.tsx";
import EditSongModal from "../../components/EditSongModal/EditSongModal";


const EditPage = () => {
    const [song, setSong] = useState<Song>();
    const [songs, setSongs] = useState<Song[]>([]);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [org, setOrg] = useState<Org>();
    const [view, setView] = useState<number>(1)
    const [piano, setPiano] = useState<boolean>(false)
    const [contributors, setContributors] = useState<Contributors[]>()

    const [blocks, setBlocks] = useState<Block[][]>()

    const [errorCode, setErrorCode] = useState<number>();
    const [errorMsg, setErrorMsg] = useState<string>();

    const songId = useParams();

    const nav = useNavigate();

    const {t} = useTranslation();

    useEffect(() => {
        SongService.getSongById(Number(songId.id)).then(async (rsp) => {
            switch (rsp.status) {
                case 200:
                    rsp.json().then((response: Song) => {
                        setSong(response);
                        localStorage["harmony-songid"] = response.composeid
                        const userId = localStorage.getItem("harmony-uid")
                        socket.emit("context", JSON.stringify( {
                            songId: response.composeid,
                            userId: userId
                        }))
                        socket.emit("contributors", response.composeid)
                        BlockService.getSongBlocksById(response.composeid).then(async (rsp) => {
                            if (rsp?.status == 200) {
                                rsp.json().then((response: Block[][]) => {
                                    setBlocks(response)
                                })
                            }

                        })
                    })
                    break;
                case 403:
                    setErrorCode(403);
                    setErrorMsg(t("pages.error.song.forbidden"));
                    break;
                case 404:
                    setErrorCode(404);
                    setErrorMsg(t("pages.error.song.notFound"));
                    break;
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
                    const info = await rsp.json() as SongPagination;
                    setSongs(info.songs);
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
        const updatedBlocks: Block[][] = JSON.parse(data)["message"];
        setBlocks((prevBlocks) => {
            if (!prevBlocks) return updatedBlocks;

            const mergedBlocks = [...prevBlocks];
            updatedBlocks.forEach((row, rowIndex) => {
                if (!mergedBlocks[rowIndex]) {
                    mergedBlocks[rowIndex] = row;
                } else {
                    const existingRow = mergedBlocks[rowIndex];

                    const syncedRow = row.map((incomingBlock, blockIndex) => {
                        const existingBlock = existingRow[blockIndex];

                        if (!existingBlock) {
                            return incomingBlock;
                        }

                        const isSameBlock =
                            existingBlock.chord === incomingBlock.chord &&
                            existingBlock.lyrics === incomingBlock.lyrics;

                        if (isSameBlock) {
                            return existingBlock;
                        } else if (incomingBlock.timestamp > existingBlock.timestamp) {
                            return incomingBlock;
                        } else {
                            return existingBlock;
                        }
                    });

                    mergedBlocks[rowIndex] = syncedRow;

                    if (existingRow.length > row.length) {
                        mergedBlocks[rowIndex] = syncedRow.slice(0, row.length);
                    }
                }
            });

            if (mergedBlocks.length > updatedBlocks.length) {
                mergedBlocks.length = updatedBlocks.length;
            }

            return mergedBlocks;
        });
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
        const updatedBlocks = [...blocks];
        updatedBlocks[rowIndex][blockIndex] = block;
        const body = {
            operation: "editBlock",
            songId: song?.composeid,
            userId: Number(localStorage.getItem("harmony-uid")),
            row: rowIndex,
            col: blockIndex,
            lyrics: block.lyrics,
            chord: block.chord,
            timestamp: block.timestamp
        }
        socket.emit('compose', JSON.stringify(body))
        setBlocks(updatedBlocks);
    }

    function handleDeleteBlock(rowIndex: number) {
        const updatedBlocks = [...blocks];
        updatedBlocks[rowIndex].pop();
        if (updatedBlocks[rowIndex].length === 0) {
            updatedBlocks.splice(rowIndex, 1);
        }
        const body = {
            operation: "deleteBlock",
            songId: song?.composeid,
            userId: Number(localStorage.getItem("harmony-uid")),
            row: rowIndex,
        }
        socket.emit('compose', JSON.stringify(body))
        setBlocks(updatedBlocks);
    }

    const handleAddBlockInRow = async (rowIndex: number) => {
        const body = {
            operation: "appendBlock",
            songId: song?.composeid,
            userId: Number(localStorage.getItem("harmony-uid")),
            row: rowIndex,
            lyrics: "",
            chord: "",
            timestamp: new Date()
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
            chord: "",
            timestamp: new Date()
        }
        socket.emit('compose', JSON.stringify(body))
        setBlocks([...blocks, [{note: '', lyric: ''}]]);
    };

    const styles = StyleSheet.create({
        body: {
            paddingTop: 35,
            paddingBottom: 65,
            paddingHorizontal: 35,
        },
        title: {
            fontSize: 32,
            fontWeight: "extrabold",
            padding: 5,
            marginBottom: 10
        },
        stanza: {
            display: "flex",
            flexDirection: "row",
            marginBottom: 5,
            marginRight: 10
        },
        row: {
            display: "flex",
            flexDirection: "column",
        },
        chord: {
            borderRadius: "25px",
            fontWeight: "bold",
            padding: 5,
            color: "rgb(74 4 78)",
            alignSelf: "flex-start",
            backgroundColor: "rgb(245 208 254)",
            fontSize: 14,
        },
        lyrics: {
            padding: 5,
            fontSize: 14,
        }
    });


    const Pdf = ({blocks}: {blocks: Block[][]}) => (
        <Document>
            <Page size="A4" style={styles.body}>
                <Text style={styles.title}>
                    {song?.name}
                </Text>
                <View id="song">
                    {blocks.map((block, index_l) => (
                        <View key={index_l} style={styles.stanza}>
                            {block.map((block, index_b) => (
                                <View key={index_l + "_" + index_b} style={styles.row}>
                                    <Text style={styles.chord}>
                                        {block?.chord}
                                    </Text>
                                    <Text style={styles.lyrics}>
                                        {block?.lyrics}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );

    if (errorCode) {
        return <ErrorPage code={errorCode} msg={errorMsg}/>;
    }

    const editSong = (song: Song) => {
        setSong(song);
        localStorage["harmony-songid"] = song.composeid
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
                                                      className={songId.id != undefined && song.id == parseInt(songId.id) ? "flex items-center w-full h-full p-3 text-fuchsia-950 bg-fuchsia-50 transition text-sm duration-75 pl-11 group" : "flex items-center w-full p-3 text-gray-900 transition text-sm duration-75 pl-11 group hover:bg-gray-100"}>{song.name}</Link>
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
                    <div className="flex flex-row gap-4 content-end">
                        <p className="ml-72 py-5 text-4xl text-fuchsia-800">{song?.name}</p>
                        {/*<EditSongModal song={song} callback={editSong}/>*/}
                    </div>
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
                            {contributors != undefined && contributors.map((contributor, index) => {
                                if(contributor.id != localStorage.getItem("harmony-uid") as number)
                                    return <div key={index} className="group flex justify-center">
                                        <div
                                            className="absolute mt-12 z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100">
                                            {contributor.name}
                                        </div>
                                        <img data-tooltip-target={"tooltip-" + contributor.id} className="w-10 h-10 rounded-full ring-2 ring-fuchsia-900"
                                             src={PROFILE_IMAGES_PATH + contributor.image} alt="Medium avatar" />
                                    </div>
                            })}
                            <div key={0} className="group flex justify-center">
                                <div
                                    className="absolute mt-12 z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100">
                                    {t("pages.edit.me")}
                                </div>
                                <img className="w-10 h-10 rounded-full ring-2 ring-fuchsia-900"
                                     src={PROFILE_IMAGES_PATH + localStorage.getItem("harmony-profile-image")} alt="Medium avatar" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <EditSongModal song={song} callback={editSong} />
                            {piano &&
                                <Tooltip message={t("pages.edit.hidePiano")} margin="top-8">
                                    <button onClick={togglePiano}
                                            className="flex text-xl text-fuchsia-950 rounded-full bg-fuchsia-300 h-10 w-10 justify-center items-center hover:bg-fuchsia-300">
                                        <CgPiano/></button>
                                </Tooltip>
                            }
                            {!piano &&
                                <Tooltip message={t("pages.edit.showPiano")} margin="top-8">
                                <button onClick={togglePiano}
                                        className="flex text-xl text-fuchsia-950 rounded-full bg-fuchsia-100 h-10 w-10 justify-center items-center hover:bg-fuchsia-300">
                                    <CgPiano/></button>
                                </Tooltip>
                            }
                            { blocks &&
                                <PDFDownloadLink document={<Pdf blocks={blocks} />} fileName={song.name ? song.name + ".pdf" : "song.pdf"}>
                                    {({loading}) =>
                                        loading ? t("pages.edit.loadingDocument") : (
                                            <Tooltip message={t("pages.edit.exportPDF")} margin="top-8">
                                                <button
                                                    className="flex text-xl text-fuchsia-950 rounded-full bg-fuchsia-100 h-10 w-10 justify-center items-center hover:bg-fuchsia-300">
                                                    <CgExport/>
                                                </button>
                                            </Tooltip>)
                                    }
                                </PDFDownloadLink>
                            }
                        </div>
                    </div>
                    {view == 1 &&
                        <div className="p-2 ml-72 mt-5 w-4/5 h-full bg-white">
                            <div>
                                {blocks && blocks.map((row, rowIndex) => (
                                    <div key={rowIndex} className="block flex flex-row flex-wrap"
                                         style={{position: 'relative'}}>
                                        <div className="flex flex-col gap-4 h-24 w-fit justify-between p-2 my-3">
                                            <div className="flex text-xl text-fuchsia-900 flex-row items-center">
                                                <p>{t("pages.edit.chord")}</p>
                                                { rowIndex == 0 &&
                                                    <Tooltip message={t("pages.edit.chordInfo")} margin="top-2">
                                                        <a className="text-lg"><IoInformationCircleSharp/></a>
                                                    </Tooltip>
                                                }
                                            </div>
                                            <div className="text-xl text-fuchsia-900">
                                                {t("pages.edit.lyrics")}
                                            </div>
                                        </div>
                                        {row.map((block: Block, blockIndex) => (
                                            <div key={blockIndex}>
                                                <AddBlock
                                                    key={rowIndex + "_" + blockIndex + "_" + block.chord + "_" + block.lyrics}
                                                    rowIndex={rowIndex}
                                                    blockIndex={blockIndex}
                                                    submit={handleUpdateBlock}
                                                    defaultBlock={block}
                                                    deleteBlock={handleDeleteBlock}
                                                    isLastBlock={blockIndex === row.length - 1}
                                                />
                                            </div>
                                        ))}
                                        {blocks[rowIndex].length < 4 && (
                                            <button onClick={() => handleAddBlockInRow(rowIndex)}
                                                    className="flex justify-center items-center border-gray-200 text-gray-200 h-24 w-20 border-2 border-dashed rounded-lg hover:border-fuchsia-300 hover:text-fuchsia-300 mt-2 ml-2">
                                                <IoAddCircleSharp className="h-10 w-10"/>
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={handleAddBlockNewRow}
                                        className="p-4 flex justify-center items-center border-gray-200 text-gray-200 h-24 w-full border-2 border-dashed rounded-lg hover:border-fuchsia-300 hover:text-fuchsia-300 mt-2">
                                    <IoAddCircleSharp className="h-10 w-10"/>
                                </button>
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
