import api from "../api/axios";

export const getRoles = async () => {
    const res = await api.get("/role");

    return res.data.data;
};

export const deleteRole = async (id) => {
    const response = await api.delete(`/role/${id}`);

    return response;
};