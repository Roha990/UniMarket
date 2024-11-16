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
            <Row className="footer-row bg-light py-2">
                <Col md={4} className="d-flex flex-column align-items-start ps-3">
                    <h6>Связь с нами</h6>
                    <p className="mb-1">Адрес: ул. Примера, д. 1</p>
                    <p className="mb-1">Телефон: +7 (123) 456-78-90</p>
                    <div className="d-flex">
                        <a href="https://vk.com" target="_blank" rel="noopener noreferrer" className="me-2 text-dark">
                            <FaVk size={18} />
                        </a>
                        <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-dark">
                            <FaTelegram size={18} />
                        </a>
                    </div>
                </Col>
                <Col md={4} className="d-flex flex-column align-items-start ps-3">
                    <a href="/about-platform" className="mb-1 text-dark text-decoration-none">О нас</a>
                    <a href="/about-platform" className="mb-1 text-dark text-decoration-none">О платформе</a>
                </Col>
                <Col md={4} className="d-flex flex-column align-items-start ps-3">
                    <h6>Возникли вопросы?</h6>
                    <p className="mb-1">
                        Напишите нам на почту <a href="mailto:unimarket@mail.ru" className="text-dark text-decoration-none">unimarket@mail.ru</a>
                    </p>
                </Col>
                <Col className="text-center mt-3">
                    UniMarket © {new Date().getFullYear()} Все права защищены
                </Col>
            </Row>
        </Container>
    );
};

export default LayoutBase;
