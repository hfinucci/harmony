import React, {useEffect, useState} from "react";
import {UserService} from "../../service/userService.ts";
import OrgCard, {Org} from "../../components/OrgCard/OrgCard";
import { IoPeopleSharp } from "react-icons/io5";


const OrgsPage = () => {

    const [orgs, setOrgs] = useState<Org[]>();


    useEffect(() => {
        (async () => {
            const userId = localStorage.getItem('harmony-uid') as string
            const response = await UserService.getUserOrgs(userId);
            const orgs = await response.json() as Org[]
            setOrgs(orgs);
        })();
    }, []);

    return (

        <div className="container h-screen mt-8 mx-auto max-w-12xl">
            <div className="text-fuchsia-950 text-4xl mb-4 flex flex-row gap-3">
                <IoPeopleSharp />
                <h1>Mis Organizaciones</h1>
            </div>
            {orgs &&
                <div className="flex flex-row flex-wrap gap-5 justify-evenly rounded-lg p-5">
                    {orgs.map((elem: Org, index: number) => (
                        <OrgCard key={index} name={elem.name} image={elem.image} id={elem.id}/>
                    ))}
                </div>
            }
        </div>
    );
};

export default OrgsPage;