import api from "../api/axios";

export const getRateById = async (id) => {
    const response = await api.get(`/rate/by-user/${id}`);
    return response.data.data;
};
export const getRateByBookId = async (id) => {
    const response = await api.get(`/rate/by-book-id/${id}`);
    return response.data.data[0] ?? null;
};
