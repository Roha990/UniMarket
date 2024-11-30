import React, { useEffect, useState } from 'react';
import { Form, Button, Modal, Spinner, Container, Row, Col, Card } from 'react-bootstrap';
import api from "../../services/apiService";
import './ProjectsList.css';
import Select from "react-select";

const InviteUser = ({ projectId, onClose }) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filters, setFilters] = useState({ skills: [] });
    const [allSkills, setAllSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/user/users', {
                    params: { project_id: projectId }
                });
                setUsers(response.data.items);
                setFilteredUsers(response.data.items);
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

        fetchUsers();
        fetchSkills();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters]);

    const applyFilters = () => {
        let filtered = users;

        if (filters.skills.length > 0) {
            filtered = filtered.filter(user =>
                filters.skills.every(skill => user.skills.includes(skill))
            );
        }

        setFilteredUsers(filtered);
    };

    const handleSkillChange = (selectedOptions) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            skills: selectedOptions.map(option => option.value)
        }));
    };

    const handleInvite = async (userId) => {
        try {
            await api.post(`/project/${projectId}/invite`, { user_id: userId, role: 'member' });
            onClose();
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
        <Modal show={true} onHide={onClose} size="lg" dialogClassName="fixed-size-modal">
            <Modal.Header closeButton>
                <Modal.Title>Пригласить участника</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col md={3}>
                            <h4>Фильтр</h4>
                            <Form>
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
                            </Form>
                        </Col>
                        <Col md={9}>
                            {filteredUsers.map(user => (
                                <Card key={user.id} className="mb-3">
                                    <Card.Body>
                                        <Card.Title>{user.full_name} ({user.username})</Card.Title>
                                        <Card.Text><strong>Навыки:</strong> {user.skills.join(', ')}</Card.Text>
                                        <Button variant="success" onClick={() => handleInvite(user.id)}>
                                            Пригласить
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default InviteUser;
