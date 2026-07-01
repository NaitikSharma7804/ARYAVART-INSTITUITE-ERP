function BrandPanel() {

    return (

        <div className="bg-slate-900 text-white p-20 flex flex-col justify-between h-full">

            <div>

                <span className="uppercase tracking-[0.3em] text-amber-400 font-semibold text-sm">

                    Aryavart Institute

                </span>

                <h1 className=" text-[68px] leading-[1.05] font-serif max-w-162.5 ">

                    Run the whole coaching institute from one place.

                </h1>

                <p className=" text-xl text-slate-400 leading-9 mt-8 max-w-155 ">

                    Attendance, Homework, Tests, Fees,

                    Reports, AI Assistant and Parent Portal.

                </p>

            </div>

            <div className=" flex justify-between max-w-130 ">

                <div>

                    <h2 className="text-3xl font-bold">

                        2340

                    </h2>

                    <p className="text-slate-400">

                        Students

                    </p>

                </div>

                <div>

                    <h2 className="text-3xl font-bold">

                        86

                    </h2>

                    <p className="text-slate-400">

                        Teachers

                    </p>

                </div>

                <div>

                    <h2 className="text-3xl font-bold">

                        94%

                    </h2>

                    <p className="text-slate-400">

                        Attendance

                    </p>

                </div>

            </div>

        </div>

    );

}

export default BrandPanel;