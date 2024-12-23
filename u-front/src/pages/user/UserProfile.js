import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Spinner, Button, Modal } from 'react-bootstrap';
import api from '../../services/apiService';
import { jwtDecode } from 'jwt-decode';
import { BsPersonCircle, BsPersonSquare, BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { getRandomColor } from "../../shared/scripts";
import './UserProfile.css';
import AddReview from './AddReview'; // Импортируем компонент для добавления отзыва

const UserProfile = () => {
    const { userId } = useParams();
    const [data, setData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [lastProject, setLastProject] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddReview, setShowAddReview] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/user/${userId}`);
                setData(response.data);

                const reviewsResponse = await api.get(`/user/${userId}/reviews`);
                setReviews(reviewsResponse.data);

                const lastProjectResponse = await api.get(`/user/${userId}/last-project`);
                setLastProject(lastProjectResponse.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5;
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<BsStarFill key={i} />);
        }

        if (halfStar) {
            stars.push(<BsStarHalf key="half" />);
        }

        for (let i = stars.length; i < 5; i++) {
            stars.push(<BsStar key={`empty-${i}`} />);
        }

        return stars;
    };

    const handleAddReview = () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setShowAddReview(true);
        }
    };

    const handleCloseAddReview = () => {
        setShowAddReview(false);
        // Обновляем отзывы после добавления нового отзыва
        const fetchUserData = async () => {
            try {
                const reviewsResponse = await api.get(`/user/${userId}/reviews`);
                setReviews(reviewsResponse.data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUserData();
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
        <Container className="user-profile-container">
            <Row className="mb-3">
                <Col>
                    <h2 className="user-profile-title">Профиль пользователя {data.username}</h2>
                </Col>
            </Row>
            <Row className="justify-content-center mt-5">
                <Col md={8}>
                    <Card className="user-profile-card">
                        <Card.Body>
                            <div className="user-profile-header">
                                <BsPersonCircle className="user-profile-icon" />
                                <div className="user-profile-info">
                                    <Card.Title className="fs-4">{data.username}</Card.Title>
                                    <Card.Text className="fs-4 fw-bold">{data.full_name}</Card.Text>
                                    <Card.Text className="fs-6 text-muted mt-1">{data.role}</Card.Text>
                                </div>
                                <Card.Text className="d-flex align-items-center mt-2">
                                    <span className="text-muted me-2 fs-7">Рейтинг:</span>
                                    <div className="fs-4">{data.rating} {renderStars(data.rating)}</div>
                                </Card.Text>
                            </div>
                            <h5 className="mt-4 mb-3 cus-title">Контактная информация</h5>
                            <hr className="my-2" />
                            <div className="d-flex justify-content-between">
                                <span>Электронная почта:</span>
                                <span>{data.email}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Номер телефона:</span>
                                <span>{data.phone_number}</span>
                            </div>
                            <h5 className="mt-4 mb-3 cus-title">Описание</h5>
                            <hr className="my-2" />
                            <Card.Text> {data.description}</Card.Text>
                            <h5 className="mt-4 mb-3 cus-title">Навыки</h5>
                            <hr className="my-2" />
                            <Card.Text>
                                <div className="user-profile-skills">
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
                            <h5 className="mt-4 mb-3 cus-title">Последний проект</h5>
                            <hr className="my-2" />
                            {lastProject && (
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Card.Title>{lastProject.title}</Card.Title>
                                        <Card.Text>{lastProject.description}</Card.Text>
                                        <Card.Text><strong>Статус:</strong> {lastProject.status}</Card.Text>
                                        <Card.Text><strong>Создано:</strong> {new Date(lastProject.created_at).toLocaleString()}</Card.Text>
                                    </Card.Body>
                                </Card>
                            )}
                            <hr />
                            <Card.Text><strong>Последние отзывы:</strong></Card.Text>
                            {reviews.map((review, index) => (
                                <Card key={index} className="mb-3">
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-2">
                                            <BsPersonSquare className="reviewer-icon" />
                                            <div className="ml-2">
                                                <Card.Text><strong>{review.reviewer}</strong></Card.Text>
                                            </div>
                                        </div>
                                        <Card.Text><strong>Оценка:</strong> {renderStars(review.rating)}</Card.Text>
                                        <Card.Text>{review.comment}</Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}
                            <hr />
                            {!!localStorage.getItem('accessToken') && (
                                <Button variant="primary" onClick={handleAddReview}>
                                    Добавить отзыв
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={showAddReview} onHide={handleCloseAddReview}>
                <AddReview userId={userId} onClose={handleCloseAddReview} />
            </Modal>
        </Container>
    );
};

export default UserProfile;
