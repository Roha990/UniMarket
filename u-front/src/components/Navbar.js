import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import { logout } from "../services/authService";
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const history = useNavigate();
    const isAuthenticated = !!localStorage.getItem('accessToken');
    const token = localStorage.getItem('accessToken');
    const decodedToken = token ? jwtDecode(token) : null;
    const isAdmin = decodedToken && decodedToken.sub.role === 'admin';

    const logoutSubmit = async () => {
        await logout();
        history('/login');
    };

    const menuItems = [
        {
            key: 'home',
            label: <Link to="/">Home</Link>,
        },
                ...(isAdmin ? [
            {
                key: 'users',
                label: <Link to="/users">Users</Link>,
            },
        ] : []),
        ...(isAuthenticated ? [
            {
                key: 'profile',
                label: <Link to="/profile">Profile</Link>,
            },
            {
                key: 'logout',
                label: 'Logout',
                onClick: logoutSubmit,
            },
        ] : []),
                ...(!isAuthenticated ? [
        {
            key: 'login',
            label: <Link to="/login">Login</Link>,
        },
        {
            key: 'register',
            label: <Link to="/register">Register</Link>,
        },
        ] : []),


    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Menu mode="horizontal" theme="dark" items={menuItems.slice(0, 1)} style={{ flex: 1 }} />
            <Menu mode="horizontal" theme="dark" items={menuItems.slice(1)} style={{ flex: 1, justifyContent: 'flex-end', display: 'flex' }} />
        </div>
    );
};

export default Navbar;
