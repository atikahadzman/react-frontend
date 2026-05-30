import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiArrowLeft } from "react-icons/hi"; 
import PDFViewer from "../PDFViewer";

const BookDetails = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const location = useLocation();
    const { user, token } = useAuth();
    const [books, setBooks] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) { 
            navigate("/login"); return; 
        }
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await axios.get(apiUrl + "/books/" + id, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const book = res.data;

            setBooks({
                ...book,
                cover_image: book.media?.find(m => m.collection_name === 'cover_image')?.original_url ?? null,
                pdf_url: book.media?.find(m => m.collection_name === 'book_url')?.original_url ?? null,
            });
        } catch (err) {
            setError("Failed to load book");
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <div class="mx-auto max-w-screen-lg px-3 py-6">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-blue-500 hover:text-white transition mb-4"
                >
                    <HiArrowLeft size={18} />
                    Back
                </button>

                {/* error */}
                {error && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {!books && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">Loading ... </p>
                    </div>
                )}

                {/* book information */}
                <div className="flex flex-col items-center md:flex-row md:justify-between md:gap-x-24">
                    <div className="shrink-0">
                        <img
                            src={books.cover_image || "/not-exist.jpg"}
                            alt={books.title}
                            className="h-80 w-64 hover:translate-y-1 rounded-xl"
                            loading="lazy"
                        />
                    </div>
                    <div>
                        <h1 className="font-poppins text-3xl font-bold text-indigo-900">
                            {books.title}
                        </h1>

                        <h4 className="font-poppins text-3xl font-bold text-gray-400">
                            by {books.author}
                        </h4>

                        <p className="mt-6 text-xl text-gray-700 pt-6">
                            {books.description}
                        </p>

                        <p className="mt-6 text-lg text-gray-700 pt-6">
                            <div class="inline-block h-3 border-l-2 border-red-600 mr-2"></div>{books.total_pages} pages
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;