import LoginCard from "../../components/LoginCard/LoginCard";
import RegisterCard from "../../components/RegisterCard/RegisterCard";

const SessionPage = () => {

    return (
        <div className="grid gap-6 grid-cols-2 flex flex-wrap">
            <div className="mt-6 ml-6 shadow-md rounded-lg bg-white p-4 flex flex-col justify-between h-fit">
                <RegisterCard />
            </div>
            <div className="mt-6 ml-6 shadow-md rounded-lg bg-white p-4 flex flex-col justify-between h-fit">
                <LoginCard />
            </div>
        </div>
    );
};

export default SessionPage;