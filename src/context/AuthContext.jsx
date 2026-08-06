import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const [expiresAt, setExpiresAt] = useState(() => localStorage.getItem("expires_at") || null);

    const loginGlobalState = (data) => {
        setToken(data.token);
        setUser(data.user);
        setExpiresAt(data.expires_at);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.expires_at) {
            localStorage.setItem("expires_at", data.expires_at);
        }
    };

    const logout = async () => {
        try { await api.post("/logout"); } catch {}
        setToken(null);
        setUser(null);
        setExpiresAt(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ token, user, expiresAt, loginGlobalState, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
