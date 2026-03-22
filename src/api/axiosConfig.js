import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Make sure this matches your Spring Boot port
});

// Add Token to every request if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;