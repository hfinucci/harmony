import { useEffect, useState } from "react";
import { UserService } from "../../service/userService";
import CreateOrgModal from "../../components/CreateOrgModal/CreateOrgModal";

const HomePage = () => {

    const [user, setUser]: any = useState()

    useEffect(() => {
        // UserService.getLoggedUser().then(async (rsp) => {
        //     if(rsp?.status == 200){
        //         const info = await rsp.json()
        //         setUser(info)
        //     }
        // })
    }, [])

    return (
        <div>
            <p>Home Page</p>
            <CreateOrgModal />
            {user && 
                <div>
                    <div>{user.name}</div>
                    <div>{user.email}</div>
                    <img src={user.image} alt="User Image"/> 
                </div>
            }
        </div>
    );
};

export default HomePage;