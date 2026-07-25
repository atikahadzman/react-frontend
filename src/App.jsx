import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/books';
import Users from './pages/users';
import Roles from './pages/roles';
import BookDetails from './pages/books/BookDetails';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Layout from "./layout/Layout";

function App() {
    const token = localStorage.getItem('token');
    const expires_at = localStorage.getItem('expires_at');

    const authenticated =
        token &&
        expiresAt &&
        new Date(expiresAt).getTime() > Date.now();

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={authenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />}
                    /> 
                    <Route
                        path="/books"
                        element={authenticated ? <Layout><Books /></Layout> : <Navigate to="/login" />}
                    />
                    <Route path="/books/:id" element={<BookDetails />} />
                    <Route
                        path="/progress"
                        element={authenticated ? <Layout><Progress /></Layout> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/users"
                        element={authenticated ? <Layout><Users /></Layout> : <Navigate to="/users" />}
                    />
                    <Route
                        path="/roles"
                        element={authenticated ? <Layout><Roles /></Layout> : <Navigate to="/roles" />}
                    />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App
