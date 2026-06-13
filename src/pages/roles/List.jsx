import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Form from "./Form";

export default function List({ roles = [], onClose, onSuccess }) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { user, token } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        setError("");
        setSuccess("");
        if (!confirm("Are you sure you want to delete this roles?")) return;

        const res = await axios.delete(apiUrl + "/role/" + id, {
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

            {roles.length === 0 ? (
                <div className="text-center py-24 font-poppins font-semibold text-white">
                    Ops, it's empty here
                </div>
            ) : (
                <table className="w-full min-w-max table-auto text-left">
                    <thead className="border-b border-slate-300 bg-slate-50/75 text-sm font-semibold text-slate-700">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                        {roles.map((role) => (
                            <tr key={role.id} className="transition-colors hover:bg-slate-50/50 text-black">
                                <td className="p-4 font-medium text-slate-900">{role.title}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => { 
                                                setEditUser(role); 
                                                setShowModal(true); 
                                            }}
                                            className="font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition"
                                        >
                                            Update
                                        </button>

                                        {showModal && editUser?.id === role.id && (
                                            <Form
                                                modalTitle="Update Role"
                                                role={editUser}
                                                onClose={() => { 
                                                    setShowModal(false); 
                                                    setEditUser(null); 
                                                }}
                                            />
                                        )}

                                        <button
                                            onClick={() => 
                                                handleDelete(role.id)
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
