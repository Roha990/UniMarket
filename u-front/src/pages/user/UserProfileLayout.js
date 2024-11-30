import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Button, Nav, Modal } from 'react-bootstrap';
import api from '../../services/apiService';
import { jwtDecode } from 'jwt-decode';
import EditUserProfile from "./EditUserProfile";

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/user/${userId}`);
                setData(response.data);
                setLoading(false);

                const token = localStorage.getItem('accessToken');
                const decodedToken = token ? jwtDecode(token) : null;
                const currentUserId = decodedToken ? decodedToken.sub : null;

                setIsOwner(currentUserId === parseInt(userId, 10));
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleEditProfile = () => {
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container fluid>
            <Row>
                <Col md={2} className="bg-light p-3">
                    <h4>Профиль пользователя</h4>
                    <Nav className="flex-column">
                        <Nav.Link as={Link} to={`/user/${userId}/profile`}>Основная информация</Nav.Link>
                        <Nav.Link as={Link} to={`/user/${userId}/projects`}>Проекты</Nav.Link>
                        <Nav.Link as={Link} to={`/user/${userId}/reviews`}>Отзывы</Nav.Link>
                        {isOwner && (
                            <Button variant="primary" onClick={handleEditProfile}>
                                Редактировать профиль
                            </Button>
                        )}
                    </Nav>
                </Col>
                <Col md={10} className="p-3">
                    <Outlet />
                </Col>
            </Row>
            <Modal show={showEditModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Редактирование профиля</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditUserProfile userId={userId} onClose={handleCloseModal} />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default UserProfile;
