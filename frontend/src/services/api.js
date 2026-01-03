const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        },
        ...options
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

// Auth API
export const authAPI = {
    login: (credentials) => apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    register: (userData) => apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    getProfile: () => apiCall('/auth/me')
};

// Tours API
export const toursAPI = {
    getAll: (filters = '') => apiCall(`/tours${filters ? `?${filters}` : ''}`),
    getById: (id) => apiCall(`/tours/${id}`),
    create: (tourData) => apiCall('/tours', {
        method: 'POST',
        body: JSON.stringify(tourData)
    }),
    update: (id, tourData) => apiCall(`/tours/${id}`, {
        method: 'PUT',
        body: JSON.stringify(tourData)
    }),
    delete: (id) => apiCall(`/tours/${id}`, {
        method: 'DELETE'
    })
};

// Bookings API
export const bookingsAPI = {
    create: (bookingData) => apiCall('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
    }),
    getAll: () => apiCall('/bookings'),
    getMy: () => apiCall('/bookings/my'),
    getById: (id) => apiCall(`/bookings/${id}`),
    updateStatus: (id, status) => apiCall(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
    })
};

// Users API (Admin)
export const usersAPI = {
    getAll: () => apiCall('/users'),
    getPending: () => apiCall('/users/pending'),
    approve: (id) => apiCall(`/users/${id}/approve`, {
        method: 'PATCH'
    }),
    delete: (id) => apiCall(`/users/${id}`, {
        method: 'DELETE'
    })
};

export default { authAPI, toursAPI, bookingsAPI, usersAPI };
