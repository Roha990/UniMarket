import React, { useState } from 'react';
import {login, register} from '../services/authService';
import { useNavigate } from 'react-router-dom';
import {Alert, Button, Form, Input, Typography} from "antd";
const { Title } = Typography;

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useNavigate();

    const handleSubmit = async (values) => {
        const { username, password } = values;
        try {
            await login(username, password);
            history('/login');
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    return <>
        <Title>Register</Title>
        <Form name="basic" onFinish={handleSubmit}>
            <Form.Item label="Username" name="username"> <Input onChange={(e) => setUsername(e.target.value)}></Input> </Form.Item>
            <Form.Item label="Password" name="password"> <Input.Password onChange={(e) => setPassword(e.target.value)}></Input.Password> </Form.Item>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
            {error && <Alert message={error} type="error" showIcon />}
        </Form>
    </>;
};

export default Register;