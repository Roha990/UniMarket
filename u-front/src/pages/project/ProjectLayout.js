import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Button, Nav, Modal } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import InviteUser from './InviteUser';
import api from "../../services/apiService"; // Импортируем компонент для приглашения пользователей

const ProjectPanel = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const response = await api.get(`/project/${projectId}`);
                setProject(response.data);
                setLoading(false);

                const token = localStorage.getItem('accessToken');
                const decodedToken = jwtDecode(token);
                const currentUserId = decodedToken.sub;

                setIsOwner(currentUserId == response.data.creator_id);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [projectId]);

    const handleInviteUser = () => {
        setShowInviteModal(true);
    };

    const handleCloseModal = () => {
        setShowInviteModal(false);
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
                    <h4>Панель проекта</h4>
                    <Nav className="flex-column">
                        <Nav.Link as={Link} to={`/project/${projectId}/details`}>Основная информация</Nav.Link>
                        <Nav.Link as={Link} to={`/project/${projectId}/members`}>Участники</Nav.Link>
                        <Nav.Link as={Link} to={`/project/${projectId}/tasks`}>Задачи</Nav.Link>
                        {isOwner && (
                            <>
                                <Button variant="primary" onClick={handleInviteUser}>
                                    Пригласить участника
                                </Button>
                            </>
                        )}
                    </Nav>
                </Col>
                <Col md={10} className="p-3">
                    <Outlet />
                </Col>
            </Row>
            <Modal show={showInviteModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Пригласить участника</Modal.Title>
                </Modal.Header>
                <InviteUser projectId={projectId} onClose={handleCloseModal} />
            </Modal>
        </Container>
    );
};

export default ProjectPanel;
