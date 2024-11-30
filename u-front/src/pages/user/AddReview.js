import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import api from '../../services/apiService';

const AddReview = ({ userId, onClose }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.post(`/user/${userId}/reviews`, { rating, comment });
            onClose();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Modal.Body className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Modal.Body>
        );
    }

    return (
        <Modal.Body>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formRating">
                    <Form.Label>Рейтинг</Form.Label>
                    <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formComment">
                    <Form.Label>Комментарий</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </Form.Group>
                {error && <p className="text-danger mt-3">{error}</p>}
                <Button variant="primary" type="submit">
                    Добавить отзыв
                </Button>
            </Form>
        </Modal.Body>
    );
};

export default AddReview;
