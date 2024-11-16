import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaPlus, FaSearch } from 'react-icons/fa';
import './Home.css';

const Home = () => {
    return (
        <Container fluid className="d-flex flex-column">
            <Row className="my-4 d-flex justify-content-between align-items-center">
                <Col xs={6} className="text-end">
                    <Button variant="outline-primary" className="mx-2">
                        <FaPlus /> Создать проект
                    </Button>
                </Col>
                <Col xs={6} className="text-start">
                    <Button variant="outline-secondary" className="mx-2">
                        <FaSearch /> Найти проект
                    </Button>
                </Col>
            </Row>
            <Row className="flex-md-row-reverse">
                <Col xs={12} md={6} className="d-flex justify-content-center align-items-center">
                    <img
                        src="path/to/your/image.jpg" // Замените на путь к вашему изображению
                        alt="UniMarket"
                        className="img-fluid"
                    />
                </Col>
                <Col xs={12} md={6} className="d-flex flex-column justify-content-center align-items-start p-4">
                    <div className="info-box p-4">
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
