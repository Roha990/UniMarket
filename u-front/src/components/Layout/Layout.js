import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import NavbarComponent from "../Navbar";
import { FaVk, FaTelegram } from 'react-icons/fa';
import './LayoutBase.css';

const LayoutBase = () => {
    return (
        <Container fluid className="d-flex flex-column min-vh-100 layout-base">
            <Row>
                <Col>
                    <NavbarComponent />
                </Col>
            </Row>
            <Row className="flex-grow-1" style={{ padding: '24px' }}>
                <Col>
                    <Outlet />
                </Col>
            </Row>
            <footer className="bg-dark text-light py-4 mt-5">
                <Container>
                    <Row className="align-items-start text-center text-md-start">
                        {/* Связь с нами */}
                        <Col md={4} className="mb-4 mb-md-0">
                            <h5 className="text-uppercase">Связь с нами</h5>
                            <p className="mb-1">Адрес: ул. Примера, д. 1</p>
                            <p className="mb-1">Телефон: +7 (123) 456-78-90</p>
                            <p>Почта: <a href="mailto:unimarket@mail.ru" className="text-light">unimarket@mail.ru</a></p>
                        </Col>

                        {/* Быстрые ссылки */}
                        <Col md={4} className="mb-4 mb-md-0">
                            <h5 className="text-uppercase">Быстрые ссылки</h5>
                            <ul className="list-unstyled">
                                <li><a href="/" className="text-light text-decoration-none">Главная</a></li>
                                <li><a href="/create-project" className="text-light text-decoration-none">Создать проект</a></li>
                                <li><a href="/projects" className="text-light text-decoration-none">Найти проект</a></li>
                                <li><a href="/about-platform" className="text-light text-decoration-none">О нас</a></li>
                            </ul>
                        </Col>

                        {/* Социальные сети */}
                        <Col md={4} className="text-md-end">
                            <h5 className="text-uppercase">Следите за нами в соц.сетях</h5>
                            <div className="d-flex justify-content-center justify-content-md-end">
                                <a href="https://vk.com" className="text-light mx-2" target="_blank" rel="noopener noreferrer">
                                    <FaVk size={24} />
                                </a>
                                <a href="https://telegram.org" className="text-light mx-2" target="_blank" rel="noopener noreferrer">
                                    <FaTelegram size={24} />
                                </a>
                            </div>
                        </Col>
                    </Row>
                    <hr className="bg-light" />
                    <Row>
                        <Col className="text-center">
                            <p className="mb-0">
                                © {new Date().getFullYear()} UniMarket. Все права защищены.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </footer>


        </Container>
    );
};

export default LayoutBase;
