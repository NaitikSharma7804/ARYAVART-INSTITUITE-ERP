import LoginCard from "../components/auth/LoginCard";

function AuthLayout({ children }) {

    return (

        <div className="min-h-screen bg-slate-900 flex justify-center items-center p-6">

            <LoginCard>

                {children}

            </LoginCard>

        </div>

    );

}

export default AuthLayout;