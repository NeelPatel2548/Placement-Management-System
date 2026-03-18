import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('pms_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle responses
api.interceptors.response.use(
    (response) => {
        // Dispatch custom event on successful mutations so sibling components can refetch
        const method = response.config.method;
        if (method === 'post' || method === 'put' || method === 'delete') {
            window.dispatchEvent(new CustomEvent('pms:data-changed'));
        }
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('pms_token');
            localStorage.removeItem('pms_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

