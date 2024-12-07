import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import api from '../../../services/apiService';

const AddDirection = ({ show, handleClose, setDirections }) => {
    const [directionName, setDirectionName] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('project/directions', { direction_name: directionName });
            setDirections(prevDirections => [...prevDirections, response.data.direction]); // Обновляем список направлений
            handleClose(); // Закрываем модальное окно
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Body className="d-flex justify-content-center align-items-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Добавить направление</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formDirectionName">
                        <Form.Label>Название направления</Form.Label>
                        <Form.Control
                            type="text"
                            value={directionName}
                            onChange={(e) => setDirectionName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {error && <p className="text-danger mt-3">{error}</p>}
                    <Button variant="primary" type="submit">
                        Добавить направление
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddDirection;
