import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import api from '../services/apiService';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { jwtDecode } from 'jwt-decode';
import {getRandomColor} from "../shared/scripts";

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/user/${userId}`);
                setData(response.data);
                setLoading(false);

                const token = localStorage.getItem('accessToken');
                const decodedToken = jwtDecode(token);
                const currentUserId = decodedToken.sub.id;

                setIsOwner(currentUserId === parseInt(userId, 10));
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleEditProfile = () => {
        navigate(`/user/${userId}/edit-profile`);
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
                    <h2>Профиль пользователя {data.username}</h2>
                </Col>
            </Row>
            <Row className="justify-content-center mt-5">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar size={64} icon={<UserOutlined />} />
                                <div style={{ marginLeft: 16 }}>
                                    <Card.Title>{data.username}</Card.Title>
                                    <Card.Text>{data.full_name}</Card.Text>
                                    <Card.Text>{data.role}</Card.Text>
                                </div>
                            </div>
                            <hr />
                            <Card.Text><strong>Электронная почта:</strong> {data.email}</Card.Text>
                            <Card.Text><strong>Номер телефона:</strong> {data.phone_number}</Card.Text>
                            <Card.Text><strong>Рейтинг:</strong> {data.rating}</Card.Text>
                            <Card.Text><strong>Описание:</strong> {data.description}</Card.Text>
                            <Card.Text>
                                <strong>Навыки:</strong>
                                <div>
                                    {data.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                backgroundColor: getRandomColor(),
                                                color: 'white',
                                                padding: '5px 10px',
                                                marginRight: '5px',
                                                borderRadius: '5px',
                                                display: 'inline-block'
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </Card.Text>
                            {isOwner && (
                                <Button variant="primary" onClick={handleEditProfile}>
                                    Редактировать профиль
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;
