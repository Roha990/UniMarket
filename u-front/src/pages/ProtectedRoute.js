import React, { useEffect, useState } from 'react';
import { Card, Avatar, Typography, Table, Skeleton } from 'antd';
import api from '../services/apiService';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UserProfile = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/user');
                setData(response.data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUserData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return <Skeleton active />;
    }

    const columns = [
        {
            title: 'Field',
            dataIndex: 'field',
            key: 'field',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        },
    ];

    const dataSource = [
        {
            key: '1',
            field: 'Email',
            value: data.email,
        },
        {
            key: '2',
            field: 'Phone Number',
            value: data.phone_number,
        },
        {
            key: '3',
            field: 'Rating',
            value: data.rating,
        },
        {
            key: '4',
            field: 'Description',
            value: data.description,
        },
    ];

    return (
        <Card style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar size={64} icon={<UserOutlined />} />
                <div style={{ marginLeft: 16 }}>
                    <Title level={4}>{data.username}</Title>
                    <Text>{data.full_name}</Text>
                    <br />
                    <Text>{data.role}</Text>
                </div>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                style={{ marginTop: 24 }}
            />
        </Card>
    );
};

export default UserProfile;
