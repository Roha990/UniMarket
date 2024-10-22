import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {logout} from "../services/authService";
import {Breadcrumb} from "antd";

const Navbar = () => {
    const history = useNavigate();
    const logoutSubmit = async (e) => {
        e.preventDefault();
        await logout();
        history('/login');
    };

    return (
    <Breadcrumb
        items={[
            {
                title: <Link to="/">Home</Link>,
            },
            {
                title: <Link to="/login">Login</Link>,
            },
            {
                title: <Link to="/register">Register</Link>,
            },
            {
                title: <Link to="/profile">profile</Link>,
            },
            {
                title: <Link to="#" onClick={logoutSubmit}>logout</Link>,
            }
        ]}
    />
);
};

export default Navbar;