import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Button, Form } from 'react-bootstrap';
import api from '../services/apiService';
import { useNavigate } from 'react-router-dom';

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
                setAllSkills(response.data.skills);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchProjects();
        fetchSkills();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters]);

    const applyFilters = () => {
        let filtered = projects;

        if (filters.direction) {
            filtered = filtered.filter(project => project.direction === filters.direction);
        }

        if (filters.skills.length > 0) {
            filtered = filtered.filter(project =>
                filters.skills.every(skill => project.skills.includes(skill))
            );
        }

        if (filters.status) {
            filtered = filtered.filter(project => project.status === filters.status);
        }

        setFilteredProjects(filtered);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleSkillChange = (e) => {
        const { options } = e.target;
        const selectedSkills = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);
        setFilters(prevFilters => ({
            ...prevFilters,
            skills: selectedSkills
        }));
    };

    const handleCreateProject = () => {
        navigate('/create-project');
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
                            <Form.Control as="select" multiple name="skills" onChange={handleSkillChange}>
                                {allSkills.map(skill => (
                                    <option key={skill.id} value={skill.name}>
                                        {skill.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Статус</Form.Label>
                            <Form.Control as="select" name="status" onChange={handleFilterChange}>
                                <option value="">Все</option>
                                <option value="active">Активные</option>
                                <option value="completed">Завершенные</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={9}>
                    {filteredProjects.map(project => (
                        <div key={project.id} className="project-card p-3 mb-3 border rounded">
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <p><strong>Навыки:</strong> {project.skills.join(', ')}</p>
                            <Button variant="success">Подать заявку</Button>
                        </div>
                    ))}
                </Col>
            </Row>
        </Container>
    );
};

export default ProjectsList;
