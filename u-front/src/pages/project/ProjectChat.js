import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import api from '../../services/apiService';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { FaUserCircle } from 'react-icons/fa';

const ProjectChat = () => {
    const { projectId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMember, setIsMember] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    const decodedToken = token ? jwtDecode(token) : null;
    const currentUserId = decodedToken ? decodedToken.sub : null;

    useEffect(() => {
        const checkMembership = async () => {
            try {
                const response = await api.get(`/project/${projectId}/is_member`, {
                    params: { current_user_id: currentUserId }
                });
                setIsMember(response.data.is_member);
                if (!response.data.is_member) {
                    navigate('/projects');
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        checkMembership();
    }, [projectId, currentUserId, navigate]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await api.get(`/project/${projectId}/messages`);
                setMessages(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        if (isMember) {
            fetchMessages(); // Initial fetch
            const interval = setInterval(fetchMessages, 2000); // Fetch every 2 seconds
            return () => clearInterval(interval); // Cleanup interval on component unmount
        }
    }, [projectId, isMember]);

    const handleSendMessage = async () => {
        try {
            const response = await api.post(`/project/${projectId}/messages`, {
                user_id: currentUserId,
                content: newMessage
            });
            setNewMessage('');
            const updatedMessages = await api.get(`/project/${projectId}/messages`);
            setMessages(updatedMessages.data);
        } catch (error) {
            alert(error.response.data.message);
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

    if (!isMember) {
        return <div>You are not a member of this project.</div>;
    }

    return (
        <Container>
            <Row className="mb-3">
                <Col>
                    <h2>Чат проекта</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="chat-container">
                        {messages.map(message => (
                            <Card key={message.id} className="message-card mb-3">
                                <Card.Body>
                                    <Card.Text>
                                        <FaUserCircle />
                                        <a href={`/user/${message.user_id}/profile`} style={{ marginLeft: '8px' }}>
                                            {message.username}
                                        </a>
                                        <small style={{ marginLeft: '8px' }}>{new Date(message.created_at).toLocaleString()}</small>
                                    </Card.Text>
                                    <Card.Text>{message.content}</Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                    <Form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                        <Form.Group controlId="formMessage">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Введите сообщение"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Отправить
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ProjectChat;
