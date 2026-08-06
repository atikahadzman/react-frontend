import api from "../api/axios";

export const loginUserAPI = async (email, password) => {
    const response = await api.post('/login', { email, password });

    const token = response.data?.token;
    const user = response.data?.user;
    const expires_at = response.data?.expires_at;

    if (!token || !expires_at) {
        throw new Error("Login error: Missing token information.");
    }

    if (email !== user?.email) {
        throw new Error("Login error: Email mismatch from server validation.");
    }

    return response.data; 
};
