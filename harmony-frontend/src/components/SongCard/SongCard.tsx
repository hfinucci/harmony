import {Song} from "../../pages/SongsPage/SongsPage.tsx";

const SongCard = (
    song: Song
) => {
    return (
        <tr>
            <td className={"text-gray-500"}>{song.name}</td>
            {song.organization && <td className={"text-gray-500"}>{song.organization}</td>}
            <td className={"text-gray-500"}>{song.creationDate}</td>
            <td className={"text-gray-500"}>{song.lastModifiedDate}</td>
            <td>
                <button>Delete</button>
            </td>
        </tr>
    )
}

export default SongCard