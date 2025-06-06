import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Login from "../pages/auth/login";
import ProtectionProvider from "../provider/ProtectionProvider";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/auth/login" replace />,
    },
    {
        path: "/auth",
        children: [
            {
                index: true, // This handles /auth route
                element: <Navigate to="/auth/login" replace />,
            },
            {
                path: "login",
                element: <Login />,
            },
        ],
    },
    {
        path: "/dashboard",
        element: <ProtectionProvider />,
        children:[
            {
                index: true,
                element: <Dashboard />,
            },
        ]
    },
    // Catch-all route for unmatched paths
    {
        path: "*",
        element: <Navigate to="/auth/login" replace />,
    },
])

export default router;