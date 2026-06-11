import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PDFViewer from "../pages/PDFViewer";
import { useAuth } from "../context/AuthContext";
import { HiPhotograph, HiDocument } from "react-icons/hi";
import Banner from "../layout/Banner";
import Progress from "../context/ProgressSection";

const Dashboard = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const mediaUrl = import.meta.env.VITE_MEDIA_URL;
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const { user, token } = useAuth();
    const [books, setBooks] = useState([]);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: "",
        author: "",
        description: "",
        total_pages: "",
        cover_image: null,
        book_url: null,
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchBooks();
        }
    }, [token]);

    const fetchBooks = async () => {
        try {
            const res = await axios.get(apiUrl + "/books", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBooks(res.data);
        } catch {
            setError("Failed to fetch books");
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <div className="w-full px-6 py-8">
                <Banner />
                
                <div className="flex flex-col gap-6 mt-6 pt-6">
                    <Progress />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;