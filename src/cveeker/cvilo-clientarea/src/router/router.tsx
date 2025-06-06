import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Login from "../pages/auth/login";

const router = createBrowserRouter([
    {
        path: "/auth",
        children: [
            {
                path: "login",
                element: <Login />,
            },
        ],
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
])

export default router;