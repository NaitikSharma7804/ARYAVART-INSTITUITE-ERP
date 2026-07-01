import { useState } from "react";

import AuthLayout from "../../layouts/AuthLayout";
import RoleSelector from "../../components/auth/RoleSelector";

function Login() {

  const [selectedRole, setSelectedRole] = useState("student");

  return (

    <AuthLayout>

      <div
        className="
flex
flex-col
justify-center
px-16
py-20
"
      >

        <h2 className="text-6xl tracking-tight font-bold">

          Sign In

        </h2>

        <p className="text-slate-500 mt-10">

          Choose your role to continue

        </p>

        <RoleSelector

          selectedRole={selectedRole}

          setSelectedRole={setSelectedRole}

        />

      </div>

    </AuthLayout>

  );

}

export default Login;