import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Card, Button } from 'react-bootstrap';
import api from '../../services/apiService';

const UserProjects = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get(`/user/${userId}/projects`);
                setProjects(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProjects();
    }, [userId]);

    const handleViewProject = (projectId) => {
        navigate(`/project/${projectId}/details`);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

        const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

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
        <Container>
            <Row className="mb-3">
                <Col>
                    <h2>Проекты пользователя</h2>
                </Col>
            </Row>
            <Row>
                {projects.map(project => (
                    <Col md={4} key={project.id}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>{project.title}</Card.Title>
                                <Card.Text>{project.description}</Card.Text>
                                <Card.Text><strong>Статус:</strong> {project.status}</Card.Text>
                                <Card.Text><strong>Создано:</strong> {formatDate(project.created_at)}</Card.Text>
                                <Button variant="primary" onClick={() => handleViewProject(project.id)}>
                                    Просмотреть проект
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default UserProjects;
