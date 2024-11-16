import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import api from '../services/apiService';
import Select from 'react-select';

const CreateProject = () => {
    const navigate = useNavigate();
    const [projectData, setProjectData] = useState({
        title: '',
        description: '',
        skills: []
    });
    const [allSkills, setAllSkills] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await api.get('/skills');
                setAllSkills(response.data.skills.map(skill => ({
                    value: skill.name,
                    label: skill.name
                })));
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSkillChange = (selectedOptions) => {
        setProjectData(prevData => ({
            ...prevData,
            skills: selectedOptions.map(option => option.value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/project/create', projectData);
            navigate('/projects');
        } catch (error) {
            setError(error.message);
        }
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
            <Row className="justify-content-center mt-5">
                <Col md={6}>
                    <h2 className="mb-4">Создать проект</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Название проекта</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={projectData.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescription">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={projectData.description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formSkills">
                            <Form.Label>Навыки</Form.Label>
                            <Select
                                isMulti
                                options={allSkills}
                                value={projectData.skills.map(skill => ({
                                    value: skill,
                                    label: skill
                                }))}
                                onChange={handleSkillChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Создать проект
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateProject;
