import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });
    const [token, setToken] = useState(localStorage.getItem('token'));

    const login = (responseData) => {
        const { token, user } = responseData;

        setToken(res.data.token);
        setUser(user);

        localStorage.setItem('token', res.data.token);
        localStorage.setItem("user", JSON.stringify(user));
    };

    const logout = async () => {
        await api.post('/logout');
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);