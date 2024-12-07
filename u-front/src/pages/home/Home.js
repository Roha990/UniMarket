import React, { useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Импорт стилей AOS
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

    // Инициализация AOS после загрузки компонента
    useEffect(() => {
        AOS.init({ duration: 1000 }); // Устанавливаем длительность анимации
    }, []);

    return (
        <Container fluid className="py-5 bg-light">
            {/* Hero Section */}
            <Row className="mb-5">
                <Col xs={12} className="text-center" data-aos="fade-up">
                    <h1 className="display-4 fw-bold text-primary">Добро пожаловать в UniMarket!</h1>
                    <p className="lead text-muted">
                        Университетская платформа для сотрудничества, обмена идеями и реализации проектов.
                    </p>
                </Col>
            </Row>

            {/* Action Buttons */}
            <Row className="mb-5 text-center">
                <Col md={6} className="d-flex justify-content-center" data-aos="fade-up">
                    <Button
                        variant="primary"
                        className="me-3 px-4 py-3 shadow"
                        size="lg"
                        onClick={handleCreateProject}
                    >
                        <FaPlus className="me-2" />
                        Создать проект
                    </Button>
                </Col>
                <Col md={6} className="d-flex justify-content-center" data-aos="fade-up">
                    <Button
                        variant="secondary"
                        className="px-4 py-3 shadow"
                        size="lg"
                        onClick={handleFindProject}
                    >
                        <FaSearch className="me-2" />
                        Найти проект
                    </Button>
                </Col>
            </Row>

            {/* About Section */}
            <Row className="align-items-center g-4" data-aos="fade-up">
                {/* Info Box */}
                <Col md={6} className="px-4">
                    <Card className="p-4 shadow-lg border-0">
                        <Card.Body>
                            <h2 className="text-primary">О проекте UniMarket</h2>
                            <p className="fs-5 text-justify info-text">
                                UniMarket - это университетская биржа проектов, где студенты могут находить команду для реализации своих идей, обмениваться опытом и сотрудничать в учебных и научных проектах.
                                Наша платформа предоставляет удобный интерфейс для поиска и создания проектов.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                {/* Image */}
                <Col md={6} className="px-4 text-center">
                    <img
                        src={`${process.env.PUBLIC_URL}/static/home.jpg`}
                        alt="UniMarket"
                        className="img-fluid rounded shadow-lg"
                        style={{ maxHeight: '400px' }}
                      /*  data-aos="zoom-in"*/
                    />
                </Col>
            </Row>

            {/* For candidate */}
            <Row className="align-items-center g-4" data-aos="fade-up">
                {/* Image */}
                <Col md={6} className="px-4 text-center">
                    <img
                        src={`${process.env.PUBLIC_URL}/static/for_cand.jpg`}
                        alt="UniMarket"
                        className="img-fluid rounded shadow-lg"
                        style={{ maxHeight: '400px' }}
                    />
                </Col>
                {/* List of advantages */}
                <Col md={6} className="px-4">
                    <Card className="p-4 shadow-lg border-0">
                        <Card.Body>
                            <h3 className="text-secondary">Для участников проекта?</h3>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <FaPlus className="text-primary me-2" />
                                    Получить опыт в реальном деле
                                </li>
                                <li className="mb-2">
                                    <FaPlus className="text-primary me-2" />
                                    Пополнить резюме крутыми проектами
                                </li>
                                <li className="mb-2">
                                    <FaPlus className="text-primary me-2" />
                                    Познакомиться с выдающимися людьми
                                </li>
                                <li className="mb-2">
                                    <FaPlus className="text-primary me-2" />
                                    Оказаться в центре постоянного развития
                                </li>
                                <li className="mb-2">
                                    <FaPlus className="text-primary me-2" />
                                    Внести свой вклад во что-то значительное
                                </li>
                                <li className="mb-2">
                                    <FaPlus className="text-primary me-2" />
                                    Найти друзей
                                </li>
                            </ul>
                            <Row>
                                <Col xs={12} className="d-flex justify-content-end">
                                    <Button
                                        variant="secondary"
                                        className="px-3 py-2 shadow text-start"
                                        size="sm"
                                        onClick={handleFindProject}
                                    >
                                        <FaSearch className="me-2" />
                                        Найти проект
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* For leaders */}
            <Row className="align-items-center g-4 mt-5" data-aos="fade-up">
                {/* List of advantages */}
                <Col md={6} className="px-4">
                    <Card className="p-4 shadow-lg border-0">
                        <Card.Body>
                            <h3 className="text-secondary">Для руководителей проекта?</h3>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <FaPlus className="text-primary me-2" />
                                    Собрать свою собственную команду
                                </li>
                                <li className="mb-2">
                                    <FaPlus className="text-primary me-2" />
                                    Реализовать самые невероятные идеи
                                </li>
                                <li className="mb-2">
                                    <FaPlus className="text-primary me-2" />
                                    Познакомиться с выдающимися людьми
                                </li>
                                <li className="mb-2">
                                    <FaPlus className="text-primary me-2" />
                                    Вдохновить других и найти вдохновение
                                </li>
                                <li className="mb-2">
                                    <FaPlus className="text-primary me-2" />
                                    Найти друзей
                                </li>
                            </ul>
                            <Row>
                                <Col xs={12} className="d-flex justify-content-end">
                                    <Button
                                        variant="primary"
                                        className="px-3 py-2 shadow text-start"
                                        size="sm"
                                        onClick={handleCreateProject}
                                    >
                                        <FaPlus className="me-2" />
                                        Создать проект
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                {/* Image */}
                <Col md={6} className="px-4 text-center">
                    <img
                        src={`${process.env.PUBLIC_URL}/static/for_leaders.jpg`}
                        alt="UniMarket"
                        className="img-fluid rounded shadow-lg"
                        style={{ maxHeight: '400px' }}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
