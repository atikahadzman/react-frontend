import api from "../api/axios";

export const getUsers = async () => {
    const res = await api.get("/user");

    return res.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/user/${id}`);

    return response;
};

export const saveUser = async (user, form) => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("role_id", form.role_id);
    formData.append("status", form.status);

    const isEditing = !!user?.id;

    const url = isEditing
        ? `/user/${user.id}`
        : '/user';

    if (isEditing) {
        formData.append("_method", "PUT");
    }

    const response = await api.post(url, formData);

    return response.data;
};