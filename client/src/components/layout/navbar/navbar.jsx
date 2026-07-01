function Navbar() {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">

            <h1 className="text-xl font-bold text-blue-600">
                Aryavart Institute
            </h1>

            <div className="flex items-center gap-4">

                <span className="text-sm text-slate-600">
                    Welcome 👋
                </span>

                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    A
                </div>

            </div>

        </header>
    );
}

export default Navbar;