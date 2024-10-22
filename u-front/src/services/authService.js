// src/services/authService.js
import api from './apiService';

export const register = async (username, password) => {
    const response = await api.post('/register', { username, password });
    return response.data;
};

export const login = async (username, password) => {
    const response = await api.post('/login', { username, password });
    localStorage.setItem('accessToken', response.data['access_token']);
    localStorage.setItem('refreshToken', response.data['refresh_token']);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};
