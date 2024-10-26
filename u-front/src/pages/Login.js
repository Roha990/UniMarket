import React, { useState } from 'react';
import {login, register} from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Form, Input, Typography } from "antd";
const { Title } = Typography;

const Register = () => {
    const [error, setError] = useState('');
    const history = useNavigate();

    const handleSubmit = async (values) => {
        const { username, password } = values;
        try {
            await login(username, password);
            history('/profile');
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <>
            <Title>Login</Title>
            <Form name="basic" onFinish={handleSubmit}>
                <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                {error && <Alert message={error} type="error" showIcon />}
            </Form>
        </>
    );
};

export default Register;
