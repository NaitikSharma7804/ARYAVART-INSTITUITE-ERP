import {
    FaHome,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaMoneyBill,
    FaBook
} from "react-icons/fa";

function Sidebar() {

    return (

        <aside className="w-64 h-screen bg-slate-900 text-white">

            <div className="text-2xl font-bold p-6 border-b border-slate-700">

                ERP

            </div>

            <nav className="mt-6">

                <a
                    href="#"
                    className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800"
                >
                    <FaHome />
                    Dashboard
                </a>

                <a
                    href="#"
                    className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800"
                >
                    <FaUserGraduate />
                    Students
                </a>

                <a
                    href="#"
                    className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800"
                >
                    <FaChalkboardTeacher />
                    Teachers
                </a>

                <a
                    href="#"
                    className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800"
                >
                    <FaMoneyBill />
                    Fees
                </a>

                <a
                    href="#"
                    className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800"
                >
                    <FaBook />
                    Homework
                </a>

            </nav>

        </aside>

    );

}

export default Sidebar;