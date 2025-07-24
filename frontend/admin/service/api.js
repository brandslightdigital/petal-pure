import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api`; // Backend URL

export const getAllHotels = async () => {
    return await axios.get(`${API_URL}/hotel/hotel-packages`);
};

export const createHotel = async (data) => {
    return await axios.post(`${API_URL}/hotel/hotel-packages`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const deleteHotel = async (id) => {
    return await axios.delete(`${API_URL}/hotel/hotel-packages/${id}`);
};

export const updateHotel = async (id, data) => {
    return await axios.put(`${API_URL}/hotel/hotel-packages/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const getAllHotelsForDropdown = async () => {
    return await axios.get(`${API_URL}/hotel/hotels-dropdown`);
};
export const getHotelPackageById = async (id) => {
    return await axios.get(`${API_URL}/hotel/hotel-packages/${id}`);
};
export const getAllSafariBookings = async () => {
    return await axios.get(`${API_URL}/booking`);
};

export const updateSafariBooking = async (id, updatedData) => {
    return await axios.put(`${API_URL}/booking/update/${id}`, updatedData); // URL सही कर दिया
};