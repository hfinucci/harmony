import { useEffect, useState } from "react";
import { UserService } from "../../service/userService";

const HomePage = () => {

    const [user, setUser]: any = useState()

    useEffect(() => {
        UserService.getLoggedUser().then((rsp) => {
            if(rsp != null)
                setUser(rsp)
        }) 
    }, [])

    return (
        <div>
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