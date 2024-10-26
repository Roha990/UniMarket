import React from 'react';
import { Card, Descriptions, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const UserProfile = ({ user }) => {
    return (
        <Card title="User Profile" bordered={false} style={{ width: 300 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <Avatar size={64} icon={<UserOutlined />} />
            </div>
            <Descriptions column={1}>
                <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
                <Descriptions.Item label="Full Name">{user.full_name}</Descriptions.Item>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">{user.phone_number}</Descriptions.Item>
                <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
                <Descriptions.Item label="Rating">{user.rating}</Descriptions.Item>
                <Descriptions.Item label="Description">{user.description}</Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

export default UserProfile;
