import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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

            const mapped = res.data.data.map((progress) => ({
                ...progress.book,
                bookmark: progress.bookmark,
                progress_id: progress.id,
                user_id: progress.user_id,
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
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-white rounded-xl flex flex-col gap-6 overflow-hidden">
                            {books.map((book) => {
                                const hasProgress = book.bookmark && book.progress_id && user?.id === book.user_id;
                                
                                return (
                                    <div
                                    key={book.id}
                                    className="flex flex-col rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4"
                                    >
                                        <div className="flex flex-col gap-6 p-2">
                                            <div className="flex flex-col items-center gap-x-8 rounded-md p-3 md:flex-row">

                                                {/* cover image */}
                                                <div className="shrink-0">
                                                    <Link to={`/books/${book.id}`}>
                                                        <img
                                                            src={book.cover_image_url || "/not-exist.jpg"}
                                                            className="w-full md:w-50 md:h-64 object-cover rounded-2xl hover:translate-x-1 transition-transform"
                                                            alt={book.title}
                                                            loading="lazy"
                                                        />
                                                    </Link>
                                                </div>

                                                {/* title and status */}
                                                <div className="flex-1 w-full">
                                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-xl font-semibold text-indigo-900 hover:translate-x-1 transition-transform">
                                                                {book.title}
                                                            </p>
                                                            <span className="text-sm text-gray-500">by {book.author}</span>
                                                            <div className={`w-fit rounded-md px-2 py-1 text-xs font-semibold whitespace-nowrap ${
                                                                book.bookmark === book.total_pages
                                                                    ? "bg-lime-400 text-lime-900"
                                                                    : hasProgress
                                                                    ? "bg-rose-400 text-rose-900"
                                                                    : "bg-sky-400 text-sky-900"
                                                            }`}>
                                                                {book.bookmark == book.total_pages ? "Completed" : hasProgress ? "In progress" : "Not started"}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* progress bar */}
                                                    <div className="flex flex-col gap-2 mt-1">
                                                        {book.bookmark === book.total_pages ? (
                                                            <>
                                                                <div className="rounded-md px-2 py-1 text-xs font-semibold bg-lime-400 text-lime-900">
                                                                    You finish the book!
                                                                </div>
                                                            </>
                                                            ) : (
                                                            <>
                                                                <div className="flex justify-between text-xs text-gray-700 mb-1">
                                                                    <span>
                                                                        {book.bookmark} / {book.total_pages} pages
                                                                    </span>
                                                                    <span>
                                                                        {Math.min(100, Math.round((book.bookmark / book.total_pages) * 100))}%
                                                                    </span>
                                                                </div>
    
                                                                <div className="rounded-md bg-gray-200 overflow-hidden h-6">
                                                                    <div
                                                                        className="bg-lime-400 h-full rounded-md transition-all"
                                                                        style={{ width: `${Math.min(100, (book.bookmark / book.total_pages) * 100)}%` }}
                                                                    />
                                                                </div>
                                                            </>
                                                        )} 
                                                    
                                                        <div className="font-poppins text-xs text-gray-700">
                                                            Last read at {book.last_read_at}
                                                        </div>
                                                    </div>

                                                    {/* action button */}
                                                    <div className="flex justify-center items-center gap-2 mt-4">
                                                        {book.book_url && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedBook(book);
                                                                    setSelectedProgressId(book.progress_id);
                                                                }}
                                                                className="text-md text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1.5 
                                                                rounded-lg transition font-medium whitespace-nowrap hover:bg-blue-400 hover:text-white transition"
                                                            >
                                                                Continue...
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
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