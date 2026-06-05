import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiArrowLeft, HiStar, HiOutlineStar } from "react-icons/hi"; 
import List from "../rates/List";

const BookDetails = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const location = useLocation();
    const { user, token } = useAuth();
    const [books, setBooks] = useState([]);
    const [error, setError] = useState("");
    const [showRating, setShowRating] = useState(false);
    const [rates, setRates] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
        fetchRates();
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

    // get rating by current user
    const fetchRates = async () => {
        try {
            const res = await axios.get(apiUrl + "/rate/by-user/" + id, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRates((prev) => ({ ...prev, [id]: res.data }));
        } catch (err) {
            if (err.response?.status !== 404) {
                setError("Failed to fetch rates");
            }
            setRates((prev) => ({ ...prev, [id]: null }));
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <div className="mx-auto max-w-screen-lg px-3 py-6">

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

                        <div className="flex justify-center items-center gap-2">
                            <h4 className="font-poppins text-3xl font-bold text-gray-400">
                                by {books.author}
                            </h4>

                            <div
                                className={`w-fit rounded-md px-2 py-1 text-sm font-semibold whitespace-nowrap ${
                                    books.status == 1
                                        ? "bg-lime-400 text-lime-900"
                                        : "bg-rose-400 text-rose-900"
                                }`}
                            >
                                {books.status == 1 ? "Enabled" : "Disabled"}
                            </div>
                        </div>

                        <p className="mt-6 text-xl text-gray-700 pt-6">
                            {books.description}
                        </p>

                        <div className="mt-6 text-lg text-gray-700 pt-6">
                            Uploaded by <span className="font-bold text-indigo-900">
                                {books.user?.name}
                            </span> &nbsp;
                            <div className="inline-block h-3 border-l-2 border-red-600 mr-2"></div>
                            {books.total_pages} pages
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center md:flex-row md:justify-between md:gap-x-24">
                    <div>
                        {rates[id] ? (
                            <div className="flex justify-center items-center gap-1">
                                <span className="text-gray-700">Rated by you</span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star}>
                                        {star <= rates[id].rating ? (
                                            <HiStar size={20} className="text-yellow-400" />
                                        ) : (
                                            <HiOutlineStar size={20} className="text-gray-300" />
                                        )}
                                    </span>
                                ))}
                                <span className="text-xs text-gray-500 ml-1">
                                    {rates[id].rating} / 5
                                </span>
                                <button
                                    onClick={() => setShowRating(true)}
                                    className="ml-2 text-xs text-blue-600 hover:underline"
                                >
                                    Edit
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowRating(true)}
                                className="flex items-center gap-2 hover:bg-gray-100 text-gray-700 text-sm font-medium transition"
                            >
                                <span className="text-lg leading-none">
                                    <HiOutlineStar size={20} />
                                </span>
                                Rate this book!
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center md:flex-row md:gap-x-24">
                    <List 
                        book_id={id} 
                    />
                </div>
            </div>
        </div>
    );
};

export default BookDetails;