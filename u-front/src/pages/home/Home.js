import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    const handleCreateProject = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
        } else {
            navigate('/create-project');
        }
    };

    const handleFindProject = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
        } else {
            navigate('/projects');
        }
    };

    return (
        <Container fluid className="d-flex flex-column">
            <Row className="my-4 d-flex justify-content-between align-items-center">
                <Col xs={6} className="text-end">
                    <Button variant="outline-primary" className="mx-2" onClick={handleCreateProject}>
                        <FaPlus /> Создать проект
                    </Button>
                </Col>
                <Col xs={6} className="text-start">
                    <Button variant="outline-secondary" className="mx-2" onClick={handleFindProject}>
                        <FaSearch /> Найти проект
                    </Button>
                </Col>
            </Row>
            <Row className="flex-md-row-reverse">
                <Col xs={12} md={6} className="d-flex justify-content-center align-items-center">
                    <img
                        src={process.env.PUBLIC_URL + '/static/home.jpg'}
                        alt="UniMarket"
                        className="img-fluid"
                    />
                </Col>
                <Col xs={12} md={6} className="d-flex flex-column justify-content-center align-items-start p-4">
                    <div className="info-box p-4">
                                                <h2>О проекте UniMarket</h2>
                        <p>
                            UniMarket - это университетская биржа проектов, где студенты могут находить команду для реализации своих идей, обмениваться опытом и сотрудничать в учебных и научных проектах. Наша платформа предоставляет удобный интерфейс для поиска и создания проектов.
                        </p>
                        <h2>Что вы найдете на UniMarket?</h2>
                        <ul>
                            <li>Значимые задачи</li>
                            <li>Вдохновляющие проекты</li>
                            <li>Постоянное развитие</li>
                            <li>Реальная практика</li>
                            <li>Собственная команда</li>
                        </ul>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
