import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import api from '../../../services/apiService';

const AddSkill = ({ show, handleClose, setSkills }) => {
    const [skillName, setSkillName] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/skills', { skill_name: skillName });
            setSkills(prevSkills => [...prevSkills, response.data.skill]); // Обновляем список скиллов
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
                <Modal.Title>Добавить скилл</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formSkillName">
                        <Form.Label>Название скилла</Form.Label>
                        <Form.Control
                            type="text"
                            value={skillName}
                            onChange={(e) => setSkillName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {error && <p className="text-danger mt-3">{error}</p>}
                    <Button variant="primary" type="submit">
                        Добавить скилл
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddSkill;
