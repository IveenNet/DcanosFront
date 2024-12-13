import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'https://dcanosestilistas.onrender.com/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configurar interceptores
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`[Axios Request]: ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {

    console.log(`[Axios Response]:`, {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      console.error('Unauthorized: Token removed.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
