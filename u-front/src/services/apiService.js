import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

export const baseURL = 'http://localhost:5000';

const api = axios.create({
    baseURL: baseURL,
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;

        if (error.response==undefined){
            return error;
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            const accessToken = localStorage.getItem('accessToken');

            if (refreshToken && accessToken) {
                const decodedToken = jwtDecode(accessToken);
                const currentTime = Math.floor(Date.now() / 1000);

                if (decodedToken.exp < currentTime) {
                    try {
                        const response = await axios.post(`${baseURL}/refresh`, { refreshToken }, {
                            headers: {'Authorization': `Bearer ${refreshToken}`}
                        });
                        const newAccessToken = response.data['access_token'];
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        localStorage.setItem('accessToken', newAccessToken);

                        return api(originalRequest);
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
