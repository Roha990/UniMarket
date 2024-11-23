import React, { useEffect, useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import api from '../../services/apiService';
import { useParams } from 'react-router-dom';

const EditProject = ({ projectId, onClose }) => {
    const [project, setProject] = useState({
        title: '',
        description: '',
        skills: [],
        users: []
    });
    const [allSkills, setAllSkills] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const projectResponse = await api.get(`/project/${projectId}`);
                setProject(projectResponse.data);

                const skillsResponse = await api.get('/skills');
                setAllSkills(skillsResponse.data.skills);

                const usersResponse = await api.get('/users');
                setAllUsers(usersResponse.data.users);

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [projectId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject(prevProject => ({
            ...prevProject,
            [name]: value
        }));
    };

    const handleSkillChange = (e) => {
        const selectedSkills = Array.from(e.target.selectedOptions, option => option.value);
        setProject(prevProject => ({
            ...prevProject,
            skills: selectedSkills
        }));
    };

    const handleUserChange = (e) => {
        const selectedUsers = Array.from(e.target.selectedOptions, option => option.value);
        setProject(prevProject => ({
            ...prevProject,
            users: selectedUsers
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/project/${projectId}`, project);
            onClose();
        } catch (error) {
            setError(error.message);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
                <Form.Label>Название проекта</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={project.title}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group controlId="formDescription">
                <Form.Label>Описание проекта</Form.Label>
                <Form.Control
                    as="textarea"
                    name="description"
                    value={project.description}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group controlId="formSkills">
                <Form.Label>Навыки</Form.Label>
                <Form.Control
                    as="select"
                    name="skills"
                    multiple
                    value={project.skills}
                    onChange={handleSkillChange}
                    required
                >
                    {allSkills.map(skill => (
                        <option key={skill.id} value={skill.id}>
                            {skill.name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="formUsers">
                <Form.Label>Участники</Form.Label>
                <Form.Control
                    as="select"
                    name="users"
                    multiple
                    value={project.users}
                    onChange={handleUserChange}
                    required
                >
                    {allUsers.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
                Сохранить изменения
            </Button>
        </Form>
    );
};

export default EditProject;
