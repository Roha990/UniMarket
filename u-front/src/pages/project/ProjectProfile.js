import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Card, Badge, ListGroup } from 'react-bootstrap';
import api from '../../services/apiService';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaTags, FaCheckCircle } from 'react-icons/fa';
import './ProjectProfile.css'; // Добавим CSS для стилизации
import { getRandomColor } from "../../shared/scripts";

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
                    <Card className="shadow mb-4 position-relative border-0">
                        <Card.Body>
                            {/* Статус проекта */}
                            <div className="project-status-badge position-absolute top-0 end-0 mt-1 me-2 fs-5">
                            <Badge bg={project.status === 'active' ? 'success' : 'danger'}>{project.status}</Badge>
                            </div>
    
                            {/* Заголовок */}
                            <Card.Title className="project-title text-center fs-3 mb-4" style={{ color: '#003366' }}>{project.title}</Card.Title>
    
                            {/* Владелец проекта */}
                            <Card.Text className="project-owner">
                                <FaUsers className="text-info me-2" />
                                <strong className="text-dark">Владелец проекта:</strong>{' '}
                                <Link to={`/user/${creator.id}/profile`} className="user-link text-primary fw-bold">
                                    {creator.username}
                                </Link>
                            </Card.Text>
    
                            {/* Навыки */}
                            <Card.Text className="project-skills">
                                <FaTags className="text-warning me-2" />
                                <strong className="text-dark">Навыки:</strong>
                                <div className="skills-container mt-2">
                                    {project.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                backgroundColor: getRandomColor(),
                                                color: 'white',
                                                padding: '5px 10px',
                                                marginRight: '5px',
                                                borderRadius: '5px',
                                                display: 'inline-block'
                                            }}
                                        
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </Card.Text>
    
                            {/* Описание */}
                            <Card.Text className="project-description">
                                <strong className="text-dark">Описание:</strong> {project.description}
                            </Card.Text>
    
                            {/* Дата создания */}
                            <div className="d-flex justify-content-end mt-auto text-muted">
                                <div className="d-flex align-items-center">
                                    <FaCalendarAlt className="text-primary me-2" />
                                    <strong className="text-dark">Создано: </strong> {new Date(project.created_at).toLocaleString()}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
    
                {/* Участники */}
                <Col md={4}>
                    <Card className="border-0" style={{ backgroundColor: '#f0f8ff' }}>
                        <Card.Body>
                            <Card.Title className="project-users-title text-primary">Участники</Card.Title>
                            <ListGroup variant="flush">
                                {project.users.map(user => (
                                    <ListGroup.Item
                                        key={user.id}
                                        action
                                        style={{
                                            backgroundColor: '#e8f4fc',
                                            border: '1px solid #d1e7ff',
                                            borderRadius: '5px',
                                            marginBottom: '5px'
                                        }}
                                    >
                                        <Link to={`/user/${user.id}/profile`} className="user-link text-primary fw-bold">
                                            {user.username}
                                        </Link>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
    
            {/* Похожие проекты */}
            <Row className="mt-5">
                <Col>
                    <h4 className="text-primary">Похожие проекты</h4>
                    {similarProjects.map(project => (
                        <Card key={project.id} className="project-card mb-3 shadow-sm border-0">
                            <Card.Body>
                                <Card.Title className="text-primary">{project.title}</Card.Title>
                                <Card.Text className="text-dark">{project.description}</Card.Text>
                                <Card.Text>
                                    <strong className="text-dark">Навыки:</strong> {project.skills.join(', ')}
                                </Card.Text>
                                <Card.Text>
                                    <strong className="text-dark">Создано:</strong> {new Date(project.created_at).toLocaleString()}
                                </Card.Text>
                                <Card.Text>
                                    <strong className="text-dark">Направление:</strong> {project.direction.join(', ')}
                                </Card.Text>
                                <Card.Text>
                                    <strong className="text-dark">Статус:</strong> {project.status}
                                </Card.Text>
                                <Link to={`/project/${project.id}/details`} className="btn btn-info text-white">
                                    Просмотреть
                                </Link>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
            </Container>
);
};

export default ProjectDetail;
