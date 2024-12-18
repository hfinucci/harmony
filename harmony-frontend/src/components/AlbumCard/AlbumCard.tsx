import { useEffect, useState } from "react";
import "./AlbumCard.css";
import { useTranslation } from "react-i18next";
import {BASE64_HEADER, IMAGE_TYPE} from "../../utils";
import ALBUM_IMAGE_DEFAULT from "../../assets/album-default-image.png";
import { Album } from "../../types/dtos/Album";
import {Link} from "react-router-dom";
import {Org} from "../../types/dtos/Org";
import {OrgService} from "../../service/orgService";
import {ImageService} from "../../service/imageService.ts";

const AlbumCard = (album: Album) => {
    const [org, setOrg] = useState<Org>();
    const [image, setImage] = useState<string>(ALBUM_IMAGE_DEFAULT);

    const { t } = useTranslation();

    useEffect(() => {
        OrgService.getOrg(album.org).then(async (rsp) => {
            if(rsp?.status == 200) {
                const o = await rsp.json()
                setOrg(o)
            }
        })
    }, []);

    useEffect(() => {
        ImageService.getImage(album.id, IMAGE_TYPE.ALBUM).then(async (rsp) => {
            if(rsp?.status == 200) {
                const img = await rsp.json();
                setImage(BASE64_HEADER + img.image)
            }
        })
    }, [album.id]);

    return (
        <Link
            to={`/albums/${album.id}`}
            className="width flex flex-col justify-between bg-white border border-2 border-white hover:border-gray-200 rounded-lg shadow"
        >
            <div className="max-h-52 flex justify-center">
                <img
                    className="h-full object-contain rounded-t-lg justify-center"
                    src={image}
                    alt="album image"
                />
            </div>
            <div className="pt-5 pr-5 pl-5">
                <h5 className="mb-2 text-2xl font-extralight tracking-tight text-gray-400">
                    {album.name}
                </h5>
                {org && (
                    <p className="mb-3 font-normal text-fuchsia-950">
                        {t("components.albumCard.org")}
                        {org.name}
                    </p>
                )}
            </div>
        </Link>
    );
};

export default AlbumCard;
