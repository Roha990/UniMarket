import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Button, Card } from 'react-bootstrap';
import api from '../../services/apiService';
import {Link, useParams} from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const ApplicationsList = () => {
    const { projectId } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('accessToken');
    const decodedToken = token ? jwtDecode(token) : null;
    const currentUserId = decodedToken ? decodedToken.sub : null;

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get(`/project/applications/${projectId}`, {
                    params: { current_user_id: currentUserId }
                });
                setApplications(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchApplications();
    }, [projectId, currentUserId]);

    const handleAcceptApplication = async (applicationId) => {
        try {
            const response = await api.post(`/project/applications/accept/${applicationId}`, {
                current_user_id: currentUserId
            });
            setApplications(applications.filter(app => app.id !== applicationId));
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const handleRejectApplication = async (applicationId) => {
        try {
            const response = await api.post(`/project/applications/reject/${applicationId}`, {
                current_user_id: currentUserId
            });
            setApplications(applications.filter(app => app.id !== applicationId));
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

    return (
        <Container>
            <Row className="mb-3">
                <Col>
                    <h2>Заявки на участие в проекте</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    {applications.map(application => (
                        <Card key={application.id} className="application-card mb-3">
                            <Card.Body>
                                <Link to={`/user/${application.user_id}/profile`} className="user-link text-primary fw-bold">
                                    {application.username}
                                </Link>
                                <Card.Text>{application.description}</Card.Text>
                                <Button variant="success" onClick={() => handleAcceptApplication(application.id)}>Принять</Button>
                                <Button variant="danger" onClick={() => handleRejectApplication(application.id)}>Отклонить</Button>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
        </Container>
    );
};

export default ApplicationsList;
