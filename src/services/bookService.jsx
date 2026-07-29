import api from "../api/axios";

export const Books = async () => {
    const response = await api.get("/books");
    return response.data;
};

export const getBook = async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
};

export const createBook = async (formData) => {
    const response = await api.post("/books", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const updateBook = async (id, formData) => {
    const response = await api.post(`/books/${id}`, formData);

    return response.data;
};

export const deleteBook = async (id) => {
    const response = await api.delete(`/books/${id}`);

    return response.data;
};