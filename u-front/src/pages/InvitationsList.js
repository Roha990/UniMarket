import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Button, Card } from 'react-bootstrap';
import api from '../services/apiService';

const InvitationsList = () => {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const response = await api.get('/user/invitations');
                setInvitations(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchInvitations();
    }, []);

    const handleAcceptInvitation = async (invitationId) => {
        try {
            await api.put(`/user/invitations/${invitationId}/accept`);
            setInvitations(invitations.filter(invitation => invitation.id !== invitationId));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleRejectInvitation = async (invitationId) => {
        try {
            await api.put(`/user/invitations/${invitationId}/reject`);
            setInvitations(invitations.filter(invitation => invitation.id !== invitationId));
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
            <Row className="mb-3">
                <Col>
                    <h2>Приглашения</h2>
                </Col>
            </Row>
            <Row>
                {invitations.map(invitation => (
                    <Col md={4} key={invitation.id}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Приглашение в проект</Card.Title>
                                <Card.Text>{invitation.description}</Card.Text>
                                <Button variant="success" onClick={() => handleAcceptInvitation(invitation.id)}>
                                    Принять
                                </Button>
                                <Button variant="danger" onClick={() => handleRejectInvitation(invitation.id)}>
                                    Отклонить
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default InvitationsList;
