import LoginCard from "../../components/LoginCard/LoginCard";

const LoginPage = () => {

    return (
        <div className="flex flex-wrap justify-center">
            <div className="mt-6 ml-6 shadow-md rounded-lg bg-white p-4 h-fit w-3/5">
                <LoginCard />
            </div>
        </div>
    );
};

export default LoginPage;