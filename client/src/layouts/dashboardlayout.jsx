import Navbar from "../components/layout/Navbar/Navbar";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import PageContainer from "../components/layout/PageContainer/PageContainer";

function DashboardLayout({ children }) {

    return (

        <div className="flex">

            <Sidebar />

            <div className="flex-1">

                <Navbar />

                <PageContainer>

                    {children}

                </PageContainer>

            </div>

        </div>

    );

}

export default DashboardLayout;