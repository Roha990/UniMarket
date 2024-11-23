import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import api from '../../services/apiService';
import Select from 'react-select';
import { getRandomColor } from '../../shared/scripts';

const EditUserProfile = ({ userId, onClose }) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        full_name: '',
        email: '',
        phone_number: '',
        role: '',
        description: '',
        skills: []
    });
    const [allSkills, setAllSkills] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await api.get(`/user/${userId}`);
                setUserData(userResponse.data);

                const skillsResponse = await api.get('/skills');
                setAllSkills(skillsResponse.data.skills.map(skill => ({
                    value: skill.name,
                    label: skill.name
                })));

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSkillChange = (selectedOptions) => {
        setUserData(prevData => ({
            ...prevData,
            skills: selectedOptions.map(option => option.value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/user/${userId}`, userData);
            onClose();
            navigate(`/user/${userId}`);
        } catch (error) {
            setError(error.message);
        }
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
        <Container>
            <Row className="mb-3">
                <Col>
                    <h2>Редактирование профиля</h2>
                </Col>
            </Row>

            <Row className="justify-content-center mt-5">
                <Col md={6}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Никнейм</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={userData.username}
                                onChange={handleChange}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group controlId="formFullName">
                            <Form.Label>ФИО</Form.Label>
                            <Form.Control
                                type="text"
                                name="full_name"
                                value={userData.full_name}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Label>Электронная почта</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPhoneNumber">
                            <Form.Label>Номер телефона</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone_number"
                                value={userData.phone_number}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescription">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={userData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formSkills">
                            <Form.Label>Навыки</Form.Label>
                            <Select
                                isMulti
                                options={allSkills}
                                value={userData.skills.map(skill => ({
                                    value: skill,
                                    label: skill,
                                    color: getRandomColor()
                                }))}
                                onChange={handleSkillChange}
                                styles={{
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.data.color,
                                        color: 'black'
                                    }),
                                    multiValue: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.data.color,
                                        color: 'black'
                                    }),
                                    multiValueLabel: (provided, state) => ({
                                        ...provided,
                                        color: 'black'
                                    }),
                                    multiValueRemove: (provided, state) => ({
                                        ...provided,
                                        color: 'black',
                                        ':hover': {
                                            backgroundColor: state.data.color,
                                            color: 'black'
                                        }
                                    })
                                }}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default EditUserProfile;
