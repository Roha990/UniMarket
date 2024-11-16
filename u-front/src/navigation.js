import {
    createBrowserRouter,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/home/Home";
import LayoutBase from "./components/Layout/Layout";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import UsersList from "./pages/AdminUsers";
import EditUserProfile from "./pages/EditUserProfile";

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
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/user/:userId",
                element: <UserProfile />,
            },
                        {
                path: "/user/:userId/edit-profile",
                element: <EditUserProfile />,
            },
            {
                path: "/logout",
                element: <Home />,
            },
            {
                path: "/users",
                element: <UsersList />,
            },
        ],
    },
]);

export default router;