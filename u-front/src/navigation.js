import {
    createBrowserRouter,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/home/Home";
import LayoutBase from "./components/Layout/Layout";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import UsersList from "./pages/admin/user/AdminUsers";
import EditUserProfile from "./pages/EditUserProfile";
import CreateProject from "./pages/CreateProject";
import ProjectsList from "./pages/ProjectsList";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminSkills from "./pages/admin/skills/AdminSkills";
import UserProfileLayout from "./pages/UserProfileLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutBase />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/admin",
                element: <AdminPanel />,
                children:[
                    {
                        path: "/admin/users",
                        element: <UsersList />,
                    },
                    {
                        path: "/admin/skills",
                        element: <AdminSkills />,
                    },
                ]
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/user/:userId",
                element: <UserProfileLayout/>,
                children:[
                                {
                path: "/user/:userId/profile",
                element: <UserProfile/>,
            },
                ]
            },
            {
                path: "/user/:userId/edit-profile",
                element: <EditUserProfile />,
            },
                        {
                path: "/create-project",
                element: <CreateProject />,
            },
            {
                path: "/logout",
                element: <Home />,
            },
                        {
                path: "/projects",
                element: <ProjectsList />,
            },
        ],
    },
]);

export default router;