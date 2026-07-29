import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard";
import Books from "./pages/books";
import Users from "./pages/users";
import Roles from "./pages/roles";
import Progress from "./pages/Progress";
import BookDetails from "./pages/books/BookDetails";

import Layout from "./layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route
                path="/dashboard"
                element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>}
            />

            <Route
                path="/books"
                element={<ProtectedRoute><Layout><Books /></Layout></ProtectedRoute>}
            />

            <Route
                path="/books/:id"
                element={<ProtectedRoute><Layout><BookDetails /></Layout></ProtectedRoute>}
            />

            <Route
                path="/users"
                element={<ProtectedRoute><Layout><Users /></Layout></ProtectedRoute>}
            />

            <Route
                path="/roles"
                element={<ProtectedRoute><Layout><Roles /></Layout></ProtectedRoute>}
            />

            <Route
                path="/progress"
                element={<ProtectedRoute><Layout><Progress /></Layout></ProtectedRoute>}
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;