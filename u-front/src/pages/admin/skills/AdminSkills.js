import React, { useEffect, useState } from 'react';
import { Button, Table, Spinner } from 'react-bootstrap';
import api from '../../../services/apiService';
import AddSkill from './AddSkill';

const AdminSkills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await api.get('/skills');
                setSkills(response.data.skills);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <Button variant="primary" onClick={handleShowModal}>
                Добавить навык
            </Button>
            <AddSkill show={showModal} handleClose={handleCloseModal} setSkills={setSkills} />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                    </tr>
                </thead>
                <tbody>
                    {skills.map(skill => (
                        <tr key={skill.id}>
                            <td>{skill.id}</td>
                            <td>{skill.name}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default AdminSkills;
