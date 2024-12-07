import React, { useEffect, useState } from 'react';
import { Button, Table, Spinner } from 'react-bootstrap';
import api from '../../../services/apiService';
import AddDirection from './AddDirection';

const AdminDirections = () => {
    const [directions, setDirections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchDirections = async () => {
            try {
                const response = await api.get('project/directions');
                setDirections(response.data.directions);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchDirections();
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
                Добавить направление
            </Button>
            <AddDirection show={showModal} handleClose={handleCloseModal} setDirections={setDirections} />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                    </tr>
                </thead>
                <tbody>
                    {directions.map(direction => (
                        <tr key={direction.id}>
                            <td>{direction.id}</td>
                            <td>{direction.name}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default AdminDirections;
