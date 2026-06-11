import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiPhotograph, HiDocument } from "react-icons/hi"; 
import Banner from "./Banner";
import List from "./List";
import Form from "./Form";

const Users = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const mediaUrl = import.meta.env.VITE_MEDIA_URL;
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [selectedProgressId, setSelectedProgressId] = useState(null);
    const { user, token } = useAuth();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchUsers();
        }
    }, [token]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(apiUrl + "/user", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUsers(res.data);
        } catch {
            setError("Failed to fetch users");
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <div className="w-full px-6 py-8">

                {/* header */}
                <Banner
                    users={users}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchUsers}
                />

                {/* error */}
                {error && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <List 
                    users={users}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchUsers}
                />
            </div>

            {/* user modal */}
            {showModal && (
                <Form
                    token={token}
                    apiUrl={apiUrl}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchUsers}
                />
            )}
        </div>
    );
};

export default Users;