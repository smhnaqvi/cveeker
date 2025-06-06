import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Login from "../pages/auth/login";

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
        element: <Dashboard />,
    },
    // Additional routes for future development
    {
        path: "/resumes",
        element: <Navigate to="/dashboard" replace />, // Temporary redirect
    },
    {
        path: "/settings", 
        element: <Navigate to="/dashboard" replace />, // Temporary redirect
    },
    // Catch-all route for unmatched paths
    {
        path: "*",
        element: <Navigate to="/auth/login" replace />,
    },
])

export default router;