import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
// icons
import { HiHome, HiBookOpen, HiBookmark, HiCog, HiLogout, HiMenu } from "react-icons/hi";   

const navItems = [
    { 
        to: "/books", 
        label: "Books", 
        icon: <HiBookOpen size={20} /> 
    },
    { 
        to: "/progress", 
        label: "Reading Progress",  
        icon: <HiBookmark size={20} />
    },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { user, token } = useAuth();
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
        <aside
            className={`
            h-screen flex flex-col border-r border-gray-200 bg-white
            transition-all duration-200
            ${collapsed ? "w-14" : "w-56"}
            `}
        >

        {/* header */}
        <div className="flex items-center gap-2 px-3 py-4 border-b border-gray-200">
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 shrink-0"
                aria-label="Toggle sidebar"
            >
                <HiMenu size={20} />
            </button>

            <span className="text-xl">
                <img
                    src="/books.png"
                    alt="logo"
                    className="w-12 h-16"
                />
            </span>

            {!collapsed && (
                <span className="font-semibold text-gray-900 text-sm truncate">
                { user?.name }'s Library
                </span>
            )}
        </div>

        {/* nav links */}
        <nav className="flex-1 p-2 space-y-1">
            {navItems.map(({ to, label, icon }) => (
                <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                    ${isActive
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`
                }
                >
                <span className="shrink-0">{icon}</span>
                {!collapsed && <span>{label}</span>}
                </NavLink>
            ))}
        </nav>

        {/* logout */}
        <div className="p-2 border-t border-gray-200">
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition"
            >
            <span className="shrink-0"> <HiLogout size={20} />  </span>
                {!collapsed && <span>Logout</span>}
            </button>
        </div>
    </aside>
    );
}