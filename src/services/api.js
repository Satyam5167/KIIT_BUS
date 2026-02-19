import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const fetchLiveBuses = async () => {
    try {
        const response = await axios.get(`${API_URL}/buses/live`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching live buses:', error);
        throw error;
    }
};

export const fetchBusRoutes = async () => {
    try {
        const response = await axios.get(`${API_URL}/getBusRoutes`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching bus routes:', error);
        throw error;
    }
};
