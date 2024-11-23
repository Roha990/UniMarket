import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Alert } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.user.role === 'admin') {
                setLoading(false);
            } else {
                setError('Access denied');
                setLoading(false);
            }
        } else {
            setError('Access denied');
            setLoading(false);
        }
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <Container>
                <Row className="justify-content-center mt-5">
                    <Col md={6}>
                        <Alert variant="danger">{error}</Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container fluid>
            <Row>
                <Col md={2} className="bg-light p-3">
                    <h4>Админ-панель</h4>
                    <Nav className="flex-column">
                        <Nav.Link as={Link} to="/admin/users">Пользователи</Nav.Link>
                        <Nav.Link as={Link} to="/admin/projects">Проекты</Nav.Link>
                        <Nav.Link as={Link} to="/admin/skills">Список навыков</Nav.Link>
                        <Nav.Link as={Link} to="/admin/project-direction">Список направление проектов</Nav.Link>
                    </Nav>
                </Col>
                <Col md={10} className="p-3">
                    <Outlet />
                </Col>
            </Row>
        </Container>
    );
};

export default AdminPanel;
