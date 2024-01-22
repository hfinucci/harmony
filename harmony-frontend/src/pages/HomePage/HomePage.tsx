import { useEffect, useState } from "react";
import { UserService } from "../../service/userService";
import { FaMusic, FaPeopleGroup } from "react-icons/fa6";
import { Organization } from "../../types/dtos/Organization";
import { Song } from "../SongsPage/SongsPage";
import { useTranslation } from "react-i18next";
import CreateOrgModal from "../../components/CreateOrgModal/CreateOrgModal";

const HomePage = () => {
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);

    const { t } = useTranslation();

    // TODO: Ask about CreateSongModal -> problem with orgId being required
    // TODO: Add org card when finished

    useEffect(() => {
        UserService.getUserOrgs("1").then((res) => {
            if (res?.status == 200) {
                res.json().then((data) => {
                    setOrgs(data);
                });
            }
        });
        UserService.getSongsByUserId(1).then((res: Song[]) => {
            setSongs(res);
        });
    }, []);

    return (
        <div className="container h-screen mx-auto flex flex-col">
            <div className="my-4">
                <div className="flex flex-row justify-between mb-4">
                    <h1 className="text-fuchsia-950 text-4xl flex flex-row">
                        <FaPeopleGroup />
                        {t("pages.home.myOrgs")}
                    </h1>
                    <CreateOrgModal />
                </div>

                <div className="flex flex-col rounded-lg bg-white p-10">
                    {orgs.length != 0 ? (
                        orgs.map((org) => <p>Organization name: {org.name}</p>)
                    ) : (
                        <p>No tienes organizaciones</p>
                    )}
                </div>
            </div>
            <div className="my-4">
                <div className="flex flex-row justify-between mb-4">
                    <h1 className="text-fuchsia-950 text-4xl flex flex-row">
                        <FaMusic />
                        Canciones Recientes
                    </h1>
                </div>

                <div className="flex flex-col rounded-lg bg-white p-10">
                    {songs.length != 0 ? (
                        songs.map((song) => (
                            <p>Organization name: {song.name}</p>
                        ))
                    ) : (
                        <p>No tienes canciones</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
