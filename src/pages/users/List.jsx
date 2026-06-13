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
                <table className="w-full min-w-max table-auto text-left">
                    <thead className="border-b border-slate-300 bg-slate-50/75 text-sm font-semibold text-slate-700">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email Address</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                        {users.map((user) => (
                        <tr key={user.id} className="transition-colors hover:bg-slate-50/50 text-black">
                            <td className="p-4 font-medium text-slate-900">{user.name}</td>
                            <td className="p-4">{user.email}</td>
                            <td className="p-4">{user.role_id === 1 ? "Admin" : "Reader"}</td>
                            <td className="p-4">
                                <span className={`w-fit rounded-md px-2 py-1 text-xs font-semibold ${
                                    user.status === 1
                                        ? "bg-lime-400 text-lime-900"
                                        : "bg-rose-400 text-rose-900"
                                    }`}>
                                    {user.status === 1 ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => { 
                                            setEditUser(user); 
                                            setShowModal(true); 
                                        }}
                                        className="font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition"
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
                                        className="font-medium text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
