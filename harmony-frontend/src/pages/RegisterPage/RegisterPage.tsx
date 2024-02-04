import RegisterCard from "../../components/RegisterCard/RegisterCard";

const RegisterPage = () => {

    return (
        <div className="flex flex-wrap justify-center">
            <div className="mt-6 ml-6 shadow-md rounded-lg bg-white p-4 h-fit w-2/3">
                <RegisterCard />
            </div>
        </div>
    );
};

export default RegisterPage;