import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onLogout }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleLogout = async () => {
        try {
            await axios.post(
                apiUrl + "/logout", {},
                { 
                headers: { Authorization: `Bearer ${token}` } 
                }
            );
        } catch {}
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-xl">
                    <img
                        src="/books.png"
                        alt="logo"
                        className="w-12 h-16"
                    />
                </span>
                <span className="font-semibold text-gray-900 text-lg">{ user?.name }'s Library</span>
            </div>
            <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 px-4 py-2 rounded-lg transition"
            >
                Logout
            </button>
        </nav>
    );
}