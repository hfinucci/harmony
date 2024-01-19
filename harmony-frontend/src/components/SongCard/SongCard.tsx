import {Song} from "../../pages/SongsPage/SongsPage.tsx";
import { MdDelete } from "react-icons/md";
import {SongService} from "../../service/songService.ts";

interface SongCardProps {
    song: Song;
    fetchSongs: () => void;
}

const SongCard = (
    {song, fetchSongs}: SongCardProps
) => {

    const deleteSong = async () => await SongService.deleteSongs(song.id).then(() => fetchSongs && fetchSongs())

    return (
        <tr>
            <td className={"text-gray-500"}>{song.name}</td>
            {song.organization && <td className={"text-gray-500"}>{song.organization}</td>}
            <td className={"text-gray-500"}>{song.created}</td>
            <td className={"text-gray-500"}>{song.lastmodified}</td>
            <td className="text-3xl text-fuchsia-950">
                <button onClick={deleteSong} className={"hover:text-fuchsia-700 flex justify-center mr-8"}>
                    <MdDelete />
                </button>
            </td>
        </tr>
    )
}

export default SongCard