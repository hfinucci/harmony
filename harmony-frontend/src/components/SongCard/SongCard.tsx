import {Song} from "../../pages/SongsPage/SongsPage.tsx";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import {SongService} from "../../service/songService.ts";
import { useNavigate } from "react-router-dom";

interface SongCardProps {
    song: Song;
    fetchSongs: () => void;
}

const SongCard = (
    {song, fetchSongs}: SongCardProps
) => {

    const deleteSong = async () => await SongService.deleteSongs(song.id).then(() => fetchSongs && fetchSongs())
    const nav = useNavigate();

    return (
        <tr>
            <td className={"text-gray-500"}>{song.name}</td>
            {song.org && <td className={"text-gray-500"}>{song.org}</td>}
            <td className={"text-gray-500"}>{song.created}</td>
            <td className={"text-gray-500"}>{song.lastmodified}</td>
            <td className="text-3xl text-fuchsia-950 flex flex-row">
                <button onClick={() => nav(`/songs/${song.id}`)} className={"hover:text-fuchsia-700 flex justify-center mr-8"}>
                    <FaEdit />
                </button>
                <button onClick={deleteSong} className={"hover:text-fuchsia-700 flex justify-center mr-8"}>
                    <MdDelete />
                </button>
            </td>
        </tr>
    )
}

export default SongCard