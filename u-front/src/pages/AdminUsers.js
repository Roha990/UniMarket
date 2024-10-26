import React, { useEffect, useState } from 'react';
import { Table, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiService';
import { jwtDecode } from 'jwt-decode';

const UsersList = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalElements: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async (page) => {
            try {
                const response = await api.get(`/user/users?page=${page}`);
                setData(response.data.items);
                setPagination({
                    page: response.data.pagination.page,
                    totalElements: response.data.pagination.totalElements,
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
            if (decodedToken.sub.role === 'admin') {
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

    const handleTableChange = (pagination) => {
        setPagination({ ...pagination, page: pagination});
    };

    const handleRowClick = (record) => {
        navigate(`/${record.id}/profile`);
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Full Name',
            dataIndex: 'full_name',
            key: 'full_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
    ];

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (loading) {
        return <Skeleton active />;
    }

    return (
        <Table
            dataSource={data}
            columns={columns}
            pagination={{
                current: pagination.page,
                total: pagination.totalElements,
                pageSize: 10,
                onChange: handleTableChange,
            }}
            rowKey="id"
            onRow={(record) => ({
                onClick: () => handleRowClick(record),
            })}
        />
    );
};

export default UsersList;
