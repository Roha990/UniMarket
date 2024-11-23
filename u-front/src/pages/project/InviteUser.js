import React, { useEffect, useState } from 'react';
import { Form, Button, Modal, Spinner, Container, Row, Col } from 'react-bootstrap';
import api from "../../services/apiService";

const InviteUser = ({ projectId, onClose }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [role, setRole] = useState('member');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/user/users');
                setUsers(response.data.items);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleInvite = async () => {
        try {
            await api.post(`/project/${projectId}/invite`, { user_id: selectedUser, role });
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
        <Modal.Body>
            <Form>
                <Form.Group controlId="formUser">
                    <Form.Label>Выберите пользователя</Form.Label>
                    <Form.Control as="select" onChange={(e) => setSelectedUser(e.target.value)}>
                        <option value="">Выберите пользователя</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.full_name} ({user.username})
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formRole">
                    <Form.Label>Выберите роль</Form.Label>
                    <Form.Control as="select" onChange={(e) => setRole(e.target.value)}>
                        <option value="member">Участник</option>
                        <option value="admin">Администратор</option>
                    </Form.Control>
                </Form.Group>
                <Button variant="primary" onClick={handleInvite}>
                    Пригласить
                </Button>
            </Form>
        </Modal.Body>
    );
};

export default InviteUser;
