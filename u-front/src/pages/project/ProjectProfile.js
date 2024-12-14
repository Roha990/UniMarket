import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Card, Badge, ListGroup } from 'react-bootstrap';
import api from '../../services/apiService';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaTags, FaCheckCircle } from 'react-icons/fa';
import './ProjectProfile.css'; // Добавим CSS для стилизации

const ProjectDetail = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [creator, setCreator] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [similarProjects, setSimilarProjects] = useState([]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.get(`/project/${projectId}`);
                setProject(response.data);

                // Fetch creator details if not included in the project data
                if (response.data.creator_id) {
                    const creatorResponse = await api.get(`/user/${response.data.creator_id}`);
                    setCreator(creatorResponse.data);
                }

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        const fetchSimilarProjects = async () => {
            try {
                const response = await api.get(`/project/${projectId}/similar`);
                setSimilarProjects(response.data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchProject();
        fetchSimilarProjects();
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
                            <Card.Text className="project-owner">
                                <FaUsers className="text-info" />
                                <strong>Владелец проекта:</strong> <Link to={`/user/${creator.id}/profile`} className="user-link">{creator.username}</Link>
                            </Card.Text>
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
            <Row className="mt-5">
                <Col>
                    <h4>Похожие проекты</h4>
                    {similarProjects.map(project => (
                        <Card key={project.id} className="project-card mb-3">
                            <Card.Body>
                                <Card.Title>{project.title}</Card.Title>
                                <Card.Text>{project.description}</Card.Text>
                                <Card.Text><strong>Навыки:</strong> {project.skills.join(', ')}</Card.Text>
                                <Card.Text><strong>Создано:</strong> {new Date(project.created_at).toLocaleString()}</Card.Text>
                                <Card.Text><strong>Направление:</strong> {project.direction.join(', ')}</Card.Text>
                                <Card.Text><strong>Статус:</strong> {project.status}</Card.Text>
                                <Link to={`/project/${project.id}/details`} className="btn btn-success">Просмотреть</Link>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
        </Container>
    );
};

export default ProjectDetail;
