import { motion } from "framer-motion";

const roles = [
    {
        id: "student",
        icon: "🎓",
        title: "Student",
        desc: "Classes, Tests, Homework"
    },
    {
        id: "parent",
        icon: "👪",
        title: "Parent",
        desc: "Track your child"
    },
    {
        id: "teacher",
        icon: "📋",
        title: "Teacher",
        desc: "Classes you teach"
    },
    {
        id: "admin",
        icon: "🏛️",
        title: "Admin",
        desc: "Institute Management"
    }
];

function RoleSelector({ selectedRole, setSelectedRole }) {

    return (

        <div className="grid grid-cols-2 gap-4 mt-8">

            {roles.map((role) => (

                <motion.button

                    key={role.id}

                    whileHover={{ scale: 1.03 }}

                    whileTap={{ scale: 0.98 }}

                    type="button"

                    onClick={() => setSelectedRole(role.id)}

                    className={`

                        rounded-2xl

                        border

                        p-4

                        text-left

                        transition-all

                        duration-300

                        ${
                            selectedRole === role.id
                                ? "border-blue-600 ring-2 ring-blue-200 bg-blue-50 shadow-lg"
                                : "border-slate-200 hover:border-blue-300"
                        }

                    `}

                >

                    <div className="text-4xl">

                        {role.icon}

                    </div>

                    <h3 className="font-semibold mt-3">

                        {role.title}

                    </h3>

                    <p className="text-sm text-slate-500 mt-1">

                        {role.desc}

                    </p>

                </motion.button>

            ))}

        </div>

    );

}

export default RoleSelector;