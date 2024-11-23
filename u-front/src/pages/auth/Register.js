import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { register } from '../../services/authService';

const Register = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { username, password } = event.target.elements;
        try {
            await register(username.value, password.value);
            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <Container>
            <Row className="justify-content-center mt-5">
                <Col md={6}>
                    <h2 className="text-center mb-4">Регистрация аккаунта</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Никнейм</Form.Label>
                            <Form.Control type="text" name="username" placeholder="Введите никнейм" required />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control type="password" name="password" placeholder="Введите пароль" required />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 mt-3">
                            Зарегистрироваться
                        </Button>
                        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                        <div className="text-center mt-3">
                            <small>Есть аккаунт? <a href="/login">Войти</a></small>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
