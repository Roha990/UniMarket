import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Card, Badge, ListGroup } from 'react-bootstrap';
import api from '../../services/apiService';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaTags, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './ProjectProfile.css'; // Добавим CSS для стилизации

const ProjectDetail = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.get(`/project/${projectId}`);
                setProject(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

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
        <Container>
            <Row className="justify-content-center mt-5">
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="project-title">{project.title}</Card.Title>
                            <Card.Text className="project-status">
                                <FaCheckCircle className={project.status === 'active' ? 'text-success' : 'text-danger'} />
                                <strong>Статус:</strong> <Badge bg={project.status === 'active' ? 'success' : 'danger'}>{project.status}</Badge>
                            </Card.Text>
                            <Card.Text className="project-created">
                                <FaCalendarAlt className="text-primary" />
                                <strong>Создано:</strong> {new Date(project.created_at).toLocaleString()}
                            </Card.Text>
                            <Card.Text className="project-skills">
                                <FaTags className="text-warning" />
                                <strong>Навыки:</strong> {project.skills.join(', ')}
                            </Card.Text>
                                                        <Card.Text className="project-description"><strong>Описание:</strong> {project.description}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="project-users-title">Участники</Card.Title>
                            <ListGroup variant="flush">
                                {project.users.map(user => (
                                    <ListGroup.Item key={user.id} action>
                                        <Link to={`/user/${user.id}/profile`} className="user-link">
                                            {user.username}
                                        </Link>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProjectDetail;
