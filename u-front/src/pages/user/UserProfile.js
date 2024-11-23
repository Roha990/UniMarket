import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import api from '../../services/apiService';
import { jwtDecode } from 'jwt-decode';
import { getRandomColor } from "../../shared/scripts";
import {BsPersonCircle, BsPersonSquare, BsStar, BsStarFill, BsStarHalf} from "react-icons/bs";
import './UserProfile.css';

const UserProfile = () => {
    const { userId } = useParams();
    const [data, setData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [lastProject, setLastProject] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/user/${userId}`);
                setData(response.data);

                const reviewsData = [
                    { rating: 5, comment: 'Great work!', reviewer: 'User1' },
                    { rating: 4, comment: 'Good job, but could be better.', reviewer: 'User2' },
                    { rating: 3, comment: 'Needs improvement.', reviewer: 'User3' }
                ];
                setReviews(reviewsData);

                // Заглушка для последнего проекта
                const lastProjectData = {
                    title: 'Project X',
                    description: 'A project about XYZ.'
                };
                setLastProject(lastProjectData);
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
                                    <Card.Title>{data.username}</Card.Title>
                                    <Card.Text>{data.full_name}</Card.Text>
                                    <Card.Text>{data.role}</Card.Text>
                                </div>
                            </div>
                            <hr />
                            <Card.Text><strong>Электронная почта:</strong> {data.email}</Card.Text>
                            <Card.Text><strong>Номер телефона:</strong> {data.phone_number}</Card.Text>
                            <Card.Text>
                                <strong>Рейтинг:</strong> {data.rating} {renderStars(data.rating)}
                            </Card.Text>
                            <Card.Text><strong>Описание:</strong> {data.description}</Card.Text>
                            <Card.Text>
                                <strong>Навыки:</strong>
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
                                                        <Card.Text><strong>Последний проект:</strong></Card.Text>
                            {lastProject && (
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{lastProject.title}</Card.Title>
                                        <Card.Text>{lastProject.description}</Card.Text>
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
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
export default UserProfile;
