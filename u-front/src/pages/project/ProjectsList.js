import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Button, Form, Card } from 'react-bootstrap';
import api from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './ProjectsList.css';
import { jwtDecode } from "jwt-decode"; // Import custom CSS

const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [filters, setFilters] = useState({ direction: '', skills: [], status: '' });
    const [allSkills, setAllSkills] = useState([]);
    const [allDirections, setAllDirections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendedProjects, setRecommendedProjects] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    const decodedToken = token ? jwtDecode(token) : null;
    const currentUserId = decodedToken ? decodedToken.sub : null;

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const params = {};
                if (filters.direction) params.direction = filters.direction;
                if (filters.skills.length > 0) params.skills = filters.skills.join(',');
                if (filters.status) params.status = filters.status;
                if (currentUserId) params.current_user_id = currentUserId;

                const response = await api.get('/project/list', { params });
                setProjects(response.data.items);
                setFilteredProjects(response.data.items);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        const fetchSkills = async () => {
            try {
                const response = await api.get('/skills');
                setAllSkills(response.data.skills.map(skill => ({
                    value: skill.id,
                    label: skill.name
                })));
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchDirections = async () => {
            try {
                const response = await api.get('project/directions');
                setAllDirections(response.data.directions.map(direction => ({
                    value: direction.id,
                    label: direction.name
                })));
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchRecommendedProjects = async () => {
            try {
                const response = await api.get(`/user/${currentUserId}/recommended_projects`);
                setRecommendedProjects(response.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setRecommendedProjects([]);
                } else {
                    setError(error.message);
                }
            }
        };

        fetchProjects();
        fetchSkills();
        fetchDirections();
        fetchRecommendedProjects();
    }, [filters, currentUserId]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleSkillChange = (selectedOptions) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            skills: selectedOptions.map(option => option.value)
        }));
    };

    const handleFilterSubmit = async () => {
        try {
            const params = {};
            if (filters.direction) params.direction = filters.direction;
            if (filters.skills.length > 0) params.skills = filters.skills.join(',');
            if (filters.status) params.status = filters.status;
            if (currentUserId) params.current_user_id = currentUserId;

            const response = await api.get('/project/list', { params });
            setFilteredProjects(response.data.items);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCreateProject = () => {
        navigate('/create-project');
    };

    const handleViewProject = (projectId) => {
        navigate(`/project/${projectId}/details`);
    };

    const handleApplyProject = async (projectId) => {
        try {
            const response = await api.post('/project/applications/apply', {
                current_user_id: currentUserId,
                project_id: projectId
            });

            setFilteredProjects(prevProjects =>
                prevProjects.map(project =>
                    project.id === projectId ? { ...project, has_invitation: true } : project
                )
            );
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
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
        <Container>
            <Row className="mb-3">
                <Col>
                    <h2>Список проектов</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleCreateProject}>
                        Создать проект
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col md={3}>
                    <h4>Фильтр</h4>
                    <Form>
                        <Form.Group controlId="formDirection">
                            <Form.Label>Направление</Form.Label>
                            <Form.Control as="select" name="direction" onChange={handleFilterChange}>
                                <option value="">Все</option>
                                {allDirections.map(direction => (
                                    <option key={direction.value} value={direction.value}>
                                        {direction.label}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formSkills">
                            <Form.Label>Навыки</Form.Label>
                            <Select
                                isMulti
                                options={allSkills}
                                value={filters.skills.map(skill => ({
                                    value: skill,
                                    label: allSkills.find(s => s.value === skill).label
                                }))}
                                onChange={handleSkillChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Статус</Form.Label>
                            <Form.Control as="select" name="status" onChange={handleFilterChange}>
                                <option value="">Все</option>
                                <option value="active">Активные</option>
                                <option value="completed">Завершенные</option>
                            </Form.Control>
                        </Form.Group>
                        <br />
                        <Button variant="primary" onClick={handleFilterSubmit}>
                            Фильтровать
                        </Button>
                    </Form>
                    <br />
                </Col>
                <Col md={6}>
                    {filteredProjects.map(project => (
                        <Card key={project.id} className="project-card mb-3">
                            <Card.Body>
                                <Card.Title>{truncateText(project.title, 50)}</Card.Title>
                                <Card.Text>{truncateText(project.description, 100)}</Card.Text>
                                <Card.Text><strong>Навыки:</strong> {project.skills.join(', ')}</Card.Text>
                                <Card.Text><strong>Создано:</strong> {formatDate(project.created_at)}</Card.Text>
                                <Card.Text><strong>Направление:</strong> {project.direction.join(', ')}</Card.Text>
                                <Card.Text><strong>Статус:</strong> {project.status}</Card.Text>
                                <Button variant="success" onClick={() => handleViewProject(project.id)}>Просмотреть</Button>
                                {project.is_member ? (
                                    <Button variant="secondary" disabled>Вы уже в проекте</Button>
                                ) : project.has_invitation ? (
                                    <Button variant="secondary" disabled>Вы уже подали заявку</Button>
                                ) : (
                                    <Button variant="primary" onClick={() => handleApplyProject(project.id)}>Подать заявку</Button>
                                )}
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
                {recommendedProjects.length > 0 && (
                    <Col md={3}>
                        <h4>Рекомендательные проекты</h4>
                        {recommendedProjects.map(project => (
                            <Card key={project.id} className="recommended-project-card mb-3">
                                <Card.Body>
                                    <Card.Title>{truncateText(project.title, 50)}</Card.Title>
                                    <Card.Text>{truncateText(project.description, 100)}</Card.Text>
                                    <Card.Text><strong>Навыки:</strong> {project.skills.join(', ')}</Card.Text>
                                    <Card.Text><strong>Создано:</strong> {formatDate(project.created_at)}</Card.Text>
                                    <Card.Text><strong>Направление:</strong> {project.direction.join(', ')}</Card.Text>
                                    <Card.Text><strong>Статус:</strong> {project.status}</Card.Text>
                                    <Button variant="success" onClick={() => handleViewProject(project.id)}>Просмотреть</Button>
                                    {project.is_member ? (
                                        <Button variant="secondary" disabled>Вы уже в проекте</Button>
                                    ) : project.has_invitation ? (
                                        <Button variant="secondary" disabled>Вы уже подали заявку</Button>
                                    ) : (
                                        <Button variant="primary" onClick={() => handleApplyProject(project.id)}>Подать заявку</Button>
                                    )}
                                </Card.Body>
                            </Card>
                        ))}
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default ProjectsList;
