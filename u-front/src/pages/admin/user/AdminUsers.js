import React, { useEffect, useState } from 'react';
import { Table, Container, Row, Col, Spinner, Pagination, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/apiService';
import { jwtDecode } from 'jwt-decode';
import EditUserProfile from '../../user/EditUserProfile'; // Import the EditUserProfile component

const UsersList = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalElements: 0, totalPages: 0 });
    const [showModal, setShowModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async (page) => {
            try {
                const response = await api.get(`/user/users?page=${page}`);
                setData(response.data.items);
                setPagination({
                    page: response.data.pagination.page,
                    totalElements: response.data.pagination.totalElements,
                    totalPages: Math.ceil(response.data.pagination.totalElements / 10), // Assuming 10 items per page
                });
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.user.role === 'admin') {
                fetchUsers(pagination.page);
            } else {
                setError('Access denied');
                setLoading(false);
            }
        } else {
            setError('Access denied');
            setLoading(false);
        }
    }, [pagination.page]);

    const handleTableChange = (newPage) => {
        setPagination((prevPagination) => ({ ...prevPagination, page: newPage }));
    };

    const handleRowClick = (record) => {
        navigate(`/user/${record.id}/profile`);
    };

    const handleEditClick = (user) => {
        setUserToEdit(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setUserToEdit(null);
    };

    const renderPaginationItems = () => {
        const items = [];
        const { page, totalPages } = pagination;

        items.push(<Pagination.First key="first" onClick={() => handleTableChange(1)} />);
        items.push(<Pagination.Prev key="prev" onClick={() => handleTableChange(page - 1)} disabled={page === 1} />);

        if (page > 3) {
            items.push(<Pagination.Item key={1} onClick={() => handleTableChange(1)}>{1}</Pagination.Item>);
            if (page > 4) {
                items.push(<Pagination.Ellipsis key="ellipsis-start" />);
            }
        }

        for (let p = Math.max(2, page - 2); p <= Math.min(totalPages - 1, page + 2); p++) {
            items.push(
                <Pagination.Item key={p} active={p === page} onClick={() => handleTableChange(p)}>
                    {p}
                </Pagination.Item>
            );
        }

        if (page < totalPages - 3) {
            if (page < totalPages - 2) {
                items.push(<Pagination.Ellipsis key="ellipsis-end" />);
            }
            items.push(<Pagination.Item key={totalPages} onClick={() => handleTableChange(totalPages)}>{totalPages}</Pagination.Item>);
        }

        items.push(<Pagination.Next key="next" onClick={() => handleTableChange(page + 1)} disabled={page === totalPages} />);
        items.push(<Pagination.Last key="last" onClick={() => handleTableChange(totalPages)} />);

        return items;
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
                    <h2>Таблица пользователей</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((user) => (
                                <tr key={user.id} onClick={() => handleRowClick(user)} style={{ cursor: 'pointer' }}>
                                    <td>{user.username}</td>
                                    <td>{user.full_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone_number}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <Button variant="primary" onClick={(e) => { e.stopPropagation(); handleEditClick(user); }}>
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="justify-content-center mt-3">
                <Col xs="auto">
                    <Pagination>{renderPaginationItems()}</Pagination>
                </Col>
            </Row>
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit User Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {userToEdit && <EditUserProfile userId={userToEdit.id} onClose={handleCloseModal} />}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default UsersList;
