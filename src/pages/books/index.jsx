import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiPhotograph, HiDocument } from "react-icons/hi"; 
import PDFViewer from "../PDFViewer";
import BookForm from "./BookForm";
import BookList from "./BookList";
import Banner from "./BookBanner";

const Books = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const mediaUrl = import.meta.env.VITE_MEDIA_URL;
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [selectedProgressId, setSelectedProgressId] = useState(null);
    const { user, token } = useAuth();
    const [books, setBooks] = useState([]);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
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
            const res = await axios.get(`${apiUrl}/book/books-progress/${user?.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const mapped = res.data.data.map((book) => {
                return {
                    ...book,
                    last_read_at: book.last_read_at
                        ? new Date(book.last_read_at).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })
                        : "Never",
                    cover_image: book.media?.find(m => m.collection_name === 'cover_image')?.original_url ?? null,
                    pdf_url: book.media?.find(m => m.collection_name === 'book_url')?.original_url ?? null,
                };
            }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            setBooks(mapped);
        } catch {
            setError("Failed to fetch books");
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <div className="w-full px-6 py-8">

                {/* header */}
                <Banner
                    books={books}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchBooks}
                />

                {/* error */}
                {error && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

            <BookList 
                books={books}
                onClose={() => setShowModal(false)}
                onSuccess={fetchBooks}
            />
        </div>

        {/* book modal */}
        {showModal && (
            <BookForm
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