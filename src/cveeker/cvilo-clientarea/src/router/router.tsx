import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Login from "../pages/auth/login";
import ProtectionProvider from "../provider/ProtectionProvider";
import CreateResume from "../pages/dashboard/resume/CreateResume";
import PreviewResume from "../pages/dashboard/resume/PreviewResume";

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
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "resume",
                children: [
                    {
                        path: "create",
                        element: <CreateResume />,
                    },
                    {
                        path: ":id",
                        element: <PreviewResume />,
                    },
                ],
            },
        ],
    },
    // Catch-all route for unmatched paths
    {
        path: "*",
        element: <Navigate to="/auth/login" replace />,
    },
])

export default router;