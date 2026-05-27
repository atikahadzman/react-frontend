import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PDFViewer from "../pages/PDFViewer";
import { useAuth } from "./AuthContext";

const ProgressSection = () => {
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
            navigate("/login"); return; 
        }
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await axios.get(apiUrl + "/progress/by-user", {
                headers: { Authorization: `Bearer ${token}` },
                params: { 
                user_id: user?.id,
                },
            });

            const mapped = res.data.map((progress) => ({
                ...progress.book,
                bookmark: progress.bookmark,
                progress_id: progress.id,
                last_read_at: new Date(progress.last_read_at).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                }),
                cover_image_url: progress.book?.media?.find(m => m.collection_name === 'cover_image')?.original_url ?? null,
                pdf_url: progress.book?.media?.find(m => m.collection_name === 'book_url')?.original_url ?? null,
            }));

            setBooks(mapped);
        } catch {
            setError("Failed to fetch books");
        }
    };

    return (
        <div className="main-card justify-center items-center">
            <div className="card-body">
                <div className="card-title">
                    <h3 className="font-poppins text-2xl font-bold text-black">
                        Your current read
                    </h3>
                </div>

                {/* book list */}
                {books.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="font-poppins font-semibold text-black">
                            Ops, no current read. How about <a href="/books"> start one? </a>
                        </div>
                    </div>
                ) : (
                <div className="grid md:grid-cols-1 gap-4 mt-6 pt-6">
                    {books.map((book) => (
                        <div key={book.id} className="flex flex-row gap-4 items-center p-3">
                            {/* cover image */}
                            {book.cover_image_url ? (
                                <img
                                    src={book.cover_image_url}
                                    alt={book.title}
                                    className="h-24 w-16 object-cover rounded-xl flex-shrink-0"
                                />
                            ) : (
                                <img src="/not-exist.jpg" alt="No cover" className="h-24 w-16 object-cover rounded-xl flex-shrink-0" />
                            )}

                            {/* book title and author */}
                            <div className="flex flex-col gap-1">
                                <div className="font-poppins font-semibold text-black">
                                    {book.title}
                                </div>

                                <div className="font-poppins text-sm text-black">
                                    by {book.author}
                                </div>
                            </div>

                            {/* progress bar */}
                            <div className="flex flex-col gap-1 pl-12"> 
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>{book.bookmark || 0} / {book.total_pages} pages</span>
                                    <span>
                                        {Math.min(
                                            100,
                                            Math.round(((book.bookmark || 0) / book.total_pages) * 100)
                                        )}%
                                    </span>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${Math.min(
                                            100,
                                            ((book.bookmark || 0) / book.total_pages) * 100
                                            )}%`,
                                        }}
                                    />
                                </div>

                                <div className="font-poppins text-xs text-gray-700">
                                    Last read at {book.last_read_at}
                                </div>
                            </div>

                            {/* continue button */}
                            <div className="flex flex-col gap-1 pl-12"> 
                                <div className="flex items-center gap-2">
                                    {book.book_url && (
                                    <button
                                        onClick={() => {
                                            setSelectedBook(book);
                                            setSelectedProgressId(book.progress_id);
                                        }}
                                        className="bg-white text-sm text-blue-800 hover:text-blue-800 border border-blue-500 hover:border-blue-400 px-3 py-1.5 rounded-lg transition font-medium"
                                    >
                                        Continue...
                                    </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                )}
            </div> 

             {/* PDF viewer — rendered outside div */}
            {selectedBook && (
                <PDFViewer
                    bookUrl={selectedBook.pdf_url}
                    bookId={selectedBook.id}
                    userId={user?.id}
                    progressId={selectedProgressId}
                    initialPage={selectedBook.bookmark || 1}
                    onClose={() => {
                        setSelectedBook(null);
                        setSelectedProgressId(null);
                    }}
                />
            )}
        </div>
    );
};

export default ProgressSection;