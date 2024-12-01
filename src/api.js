import axios from 'axios';

// Create an instance of axios with default settings
const apiClient = axios.create({
  baseURL: 'https://backend-nfzv.onrender.com/api',  //
  timeout: 10000,                      // Request timeout
});

// Request Interceptor to add authorization token if needed
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');  // or use other storage methods
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors here
    if (error.response && error.response.status === 401) {
      // Unauthorized access - redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);

// GET request
export const get = (url, params) => {
  return apiClient.get(url, { params });
};

// POST request
export const post = (url, data) => {
  return apiClient.post(url, data);
};

// PUT request
export const put = (url, data) => {
  return apiClient.put(url, data);
};

// DELETE request
export const remove = (url) => {
  return apiClient.delete(url);
};