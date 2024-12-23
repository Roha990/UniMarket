import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { logout } from "../services/authService";
import { jwtDecode } from 'jwt-decode';
import {BsPersonCircle} from 'react-icons/bs';

const NavbarComponent = () => {
    const history = useNavigate();
    const isAuthenticated = !!localStorage.getItem('accessToken');
    const token = localStorage.getItem('accessToken');
    const decodedToken = token ? jwtDecode(token) : null;
    let isAdmin = false;
    let fullName = "";
    if (decodedToken && decodedToken.user){
         isAdmin = decodedToken.user.role === 'admin';
         fullName = decodedToken.user.full_name;
    }

    const logoutSubmit = async () => {
        await logout();
        history('/login');
    };

    return (
        <Navbar expand="lg" style={{ backgroundColor: '#97c8c8'}}>
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
                        <Nav.Link as={Link} to="/projects">Проекты</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        {isAdmin && (
                            <Nav.Link as={Link} to="/admin/users">Админ-панель</Nav.Link>
                        )}
                        {isAuthenticated && (
                            <NavDropdown title={
                                <>
                                    <BsPersonCircle/>
                                     {` ${fullName}`}
                                </>
                            } id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to={`/user/${decodedToken.sub}/profile`}>Мой профиль</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/invitations">Приглашения</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={logoutSubmit}> Выйти из учетной записи</NavDropdown.Item>
                            </NavDropdown>
                        )}
                        {!isAuthenticated && (
                            <Nav.Link as={Link} to="/login">Войти</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
