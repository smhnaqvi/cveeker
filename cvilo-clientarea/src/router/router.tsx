import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import LinkedInCallback from "../pages/auth/LinkedInCallback";
import ProtectionProvider from "../provider/ProtectionProvider";
import CreateResume from "../pages/dashboard/resume/CreateResume";
import PreviewResume from "../pages/dashboard/resume/PreviewResume";
import EditResume from "../pages/dashboard/resume/EditResume";

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
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "linkedin/callback",
                element: <LinkedInCallback />,
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
                path: ":id",
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
                        path: ":id/preview",
                        element: <PreviewResume />,
                    },
                    {
                        path: ":id/edit",
                        element: <EditResume />,
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