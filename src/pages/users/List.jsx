import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Form from "./Form";

export default function List({ users = [], onClose, onSuccess }) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [selectedProgressId, setSelectedProgressId] = useState(null);
    const { user, token } = useAuth();
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) { 
            navigate("/login"); return; 
        }
    }, []);

    const handleDelete = async (id) => {
        setError("");
        setSuccess("");
        if (!confirm("Are you sure you want to delete this user?")) return;

        const res = await axios.delete(apiUrl + "/user/" + id, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status == 'success') {
            setSuccess(res.data.message);
        } else {
            setError(res.data.message);
        }
        window.location.reload();
    };

    return (
        <div className="w-full px-6 py-8">
            {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}
            {success && (
                <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-600">{success}</p>
                </div>
            )}

            {users.length === 0 ? (
                <div className="text-center py-24 font-poppins font-semibold text-white">
                    Ops, it's empty here
                </div>
            ) : (
                <div className="w-full overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-400">
                    <thead className="bg-gray-50 dark:bg-dark-0">
                        <tr className="font-poppins text-black text-sm">
                            <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-start font-medium uppercase tracking-wider">
                                Role
                            </th>
                            <th className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-400 font-poppins text-black">
                        {users.map((user) => (
                            <tr key={user.id} className="transition-colors hover:bg-gray-100 dark:hover:bg-dark-0 text-sm">
                                <td className="whitespace-nowrap px-6 py-4">
                                    {user.name}
                                    <div className={`rounded-md px-2 py-1 text-xs font-semibold whitespace-nowrap ${
                                        user.status === "1"
                                            ? "bg-lime-400 text-lime-900"
                                            : "bg-rose-400 text-rose-900"
                                        }`}>
                                        {user.status === "1" ? "Active" : "Inactive"}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    {user.email}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    {user.role_id === 1 ? "Admin" : "Reader" }
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => { 
                                                setEditUser(user); 
                                                setShowModal(true); 
                                            }}
                                            className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg transition font-medium"
                                        >
                                            Update
                                        </button>

                                        {showModal && editUser?.id === user.id && (
                                            <Form
                                                modalTitle="Update User"
                                                user={editUser}
                                                onClose={() => { 
                                                    setShowModal(false); 
                                                    setEditUser(null); 
                                                }}
                                            />
                                        )}

                                        <button
                                            onClick={() => 
                                                handleDelete(user.id)
                                            }
                                            className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-lg transition font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            )}
        </div>
    );
};
