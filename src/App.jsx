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
import BookDetails from './pages/books/BookDetails';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Layout from "./layout/Layout";

function App() {
    const token = localStorage.getItem('token');

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={token ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />}
                    /> 
                    <Route
                        path="/books"
                        element={token ? <Layout><Books /></Layout> : <Navigate to="/login" />}
                    />
                    <Route path="/books/:id" element={<BookDetails />} />
                    <Route
                        path="/progress"
                        element={token ? <Layout><Progress /></Layout> : <Navigate to="/login" />}
                    />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App
