import {
    createBrowserRouter,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import LayoutBase from "./components/Layout";
import ProtectedComponent from "./pages/ProtectedRoute";
import Register from "./pages/Register";
import UserProfile from "./pages/ProtectedRoute";
import UsersList from "./pages/AdminUsers";

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
                path: "/profile",
                element: <UserProfile />,
            },
            {
                path: "/logout",
                element: <ProtectedComponent />,
            },
            {
                path: "/users",
                element: <UsersList />,
            },
        ],
    },
]);

export default router;