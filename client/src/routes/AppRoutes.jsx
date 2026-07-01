import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Login />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;