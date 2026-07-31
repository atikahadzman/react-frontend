import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiPhotograph, HiDocument } from "react-icons/hi"; 
import PDFViewer from "../PDFViewer";
import Form from "./Form";
import List from "./List";
import Banner from "./Banner";
import ErrorAlert from "../../alert/ErrorAlert";
import { getBookProgressByUser } from "../../services/bookService";

const Books = () => {
    const { user, token } = useAuth();
    const [books, setBooks] = useState([]);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchBooks();
    }, [token]);

    const fetchBooks = async () => {
        try {
            const data = await getBookProgressByUser(user?.id);
            setBooks(data);
        } catch (err) {
            setError("Failed to fetch booksfhbgfdh");
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#1e1e2c]">
            <div className="w-full px-6 py-8">

                {/* header */}
                <Banner
                    books={books}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchBooks}
                />

                {/* error */}
                {error && (
                    <ErrorAlert message={error}/>
                )}

                <List 
                    books={books}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchBooks}
                />
            </div>

            {/* book modal */}
            {showModal && (
                <Form
                    token={token}
                    apiUrl={apiUrl}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchBooks}
                />
            )}
        </div>
    );
};

export default Books;