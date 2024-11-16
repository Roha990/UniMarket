import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { logout } from "../services/authService";
import { jwtDecode } from 'jwt-decode';

const NavbarComponent = () => {
    const history = useNavigate();
    const isAuthenticated = !!localStorage.getItem('accessToken');
    const token = localStorage.getItem('accessToken');
    const decodedToken = token ? jwtDecode(token) : null;
    const isAdmin = decodedToken && decodedToken.sub.role === 'admin';

    const logoutSubmit = async () => {
        await logout();
        history('/login');
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src={process.env.PUBLIC_URL + '/static/logo.png'}
                        alt="Logo"
                        height="40"
                        className="d-inline-block"
                    />{' UniMarket'}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {isAdmin && (
                            <Nav.Link as={Link} to="/users">Пользователи</Nav.Link>
                        )}
                        {isAuthenticated && (
                            <>
                                <Nav.Link as={Link} to={`/user/${decodedToken.sub.id}`}>Мой профиль</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav className="ms-auto">
                        {isAuthenticated ? (
                            <Nav.Link onClick={logoutSubmit}>Выйти из учетной записи</Nav.Link>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Войти</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
