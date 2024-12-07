import {
    createBrowserRouter,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Home from "./pages/home/Home";
import LayoutBase from "./components/Layout/Layout";
import Register from "./pages/auth/Register";
import UserProfile from "./pages/user/UserProfile";
import UsersList from "./pages/admin/user/AdminUsers";
import CreateProject from "./pages/project/CreateProject";
import ProjectsList from "./pages/project/ProjectsList";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminSkills from "./pages/admin/skills/AdminSkills";
import UserProfileLayout from "./pages/user/UserProfileLayout";
import ProjectProfile from "./pages/project/ProjectProfile";
import ProjectLayout from "./pages/project/ProjectLayout";
import InvitationsList from "./pages/InvitationsList";
import UserProjects from "./pages/user/UserProjects";
import ApplicationList from "./pages/project/ApplicationList";
import ProjectChat from "./pages/project/ProjectChat";
import AdminDirections from "./pages/admin/direction/AdminDirection";

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
                     {
                        path: "/admin/direction",
                        element: <AdminDirections />,
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
                                        {
                path: "/user/:userId/projects",
                element: <UserProjects/>,
                    },
                ]
            },
            {
                path: "/create-project",
                element: <CreateProject />,
            },
            {
                path: "/project/:projectId",
                element: <ProjectLayout/>,
                children:[
                    {
                path: "/project/:projectId/details",
                element: <ProjectProfile/>,
                    },
                    {
                path: "/project/:projectId/applications",
                element: <ApplicationList/>,
                    },
                                        {
                path: "/project/:projectId/chat",
                element: <ProjectChat/>,
                    },
                ]
            },
            {
                path: "/logout",
                element: <Home />,
            },
                        {
                path: "/invitations",
                element: <InvitationsList />,
            },
                        {
                path: "/projects",
                element: <ProjectsList />,
            },
        ],
    },
]);

export default router;