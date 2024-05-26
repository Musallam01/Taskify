import axios from 'axios';

const BASE_URL = 'http://192.168.100.3:5000'

export const getTasks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};