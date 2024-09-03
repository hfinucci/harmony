import {Song} from "../../types/dtos/Song";
import { FaEdit } from "react-icons/fa";
import {SongService} from "../../service/songService.ts";
import { useNavigate } from "react-router-dom";
import DeleteSongModal from "../DeleteSongModal/DeleteSongModal";
import { formatDate } from "../../utils"

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
        <tr  className={song.org? "grid grid-cols-5 w-full" : "grid grid-cols-4 w-full"}>
            <td className={"text-gray-500"}>{song.name}</td>
            {song.org && <td className={"text-gray-500"}>{song.org}</td>}
            <td className={"text-gray-500"}>{formatDate(song.created)}</td>
            <td className={"text-gray-500"}>{formatDate(song.lastmodified)}</td>
            <td className="text-3xl text-fuchsia-950 flex flex-row">
                <button onClick={() => nav(`/songs/${song.id}`)} className={"hover:text-fuchsia-700 flex justify-center mr-8"}>
                    <FaEdit />
                </button>
                <DeleteSongModal songId={song.id} callback={deleteSong} />
            </td>
        </tr>
    )
}

export default SongCard