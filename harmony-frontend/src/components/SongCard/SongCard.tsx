import {Song} from "../../pages/SongsPage/SongsPage.tsx";

const SongCard = (
    song: Song
) => {
    return (
        <tr>
            <td className={"text-gray-500"}>{song.song}</td>
            {song.org && <td className={"text-gray-500"}>{song.org}</td>}
            <td className={"text-gray-500"}>{song.created}</td>
            <td className={"text-gray-500"}>{song.lastmodified}</td>
            <td>
                <button>Delete</button>
            </td>
        </tr>
    )
}

export default SongCard