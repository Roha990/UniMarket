import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Button, Form, Card } from 'react-bootstrap';
import api from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './ProjectsList.css'; // Import custom CSS

const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [filters, setFilters] = useState({ direction: '', skills: [], status: '' });
    const [allSkills, setAllSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/project/list');
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

        fetchProjects();
        fetchSkills();
    }, []);

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
            const response = await api.get('/project/list', {
                params: {
                    direction: filters.direction,
                    skills: filters.skills.join(','),
                    status: filters.status
                }
            });
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
                                {/* Добавьте сюда опции направлений */}
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
                        <Button variant="primary" onClick={handleFilterSubmit}>
                            Отфильтровать
                        </Button>
                    </Form>
                </Col>
                <Col md={9}>
                    {filteredProjects.map(project => (
                        <Card key={project.id} className="project-card mb-3">
                            <Card.Body>
                                <Card.Title>{truncateText(project.title, 50)}</Card.Title>
                                <Card.Text>{truncateText(project.description, 100)}</Card.Text>
                                <Card.Text><strong>Навыки:</strong> {project.skills.join(', ')}</Card.Text>
                                <Card.Text><strong>Создано:</strong> {formatDate(project.created_at)}</Card.Text>
                                <Button variant="success" onClick={() => handleViewProject(project.id)}>Просмотреть</Button>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
        </Container>
    );
};

export default ProjectsList;
