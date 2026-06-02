import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiBookOpen, HiX } from "react-icons/hi"; 
import PDFViewer from "../PDFViewer";
import BookForm from "./BookForm";

export default function BookList({ books = [], onClose, onSuccess }) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [selectedProgressId, setSelectedProgressId] = useState(null);
    const { user, token } = useAuth();
    const [selectedBook, setSelectedBook] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editBook, setEditBook] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [search, setSearch] = useState("");
    const [filterBook, setFilterBook] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) { 
            navigate("/login"); return; 
        }
    }, []);

    const handleDelete = async (id) => {
        setError("");
        setSuccess("");
        if (!confirm("Are you sure you want to delete this book?")) return;

        const res = await axios.delete(apiUrl + "/books/" + id, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status == 'success') {
            setSuccess(res.data.message);
        } else {
            setError(res.data.message);
        }
        window.location.reload();
    };

    // for filter purpose
    const getBookStatus = (book) => {
        if (book.bookmark == null) return "not_started";
        if (Number(book.bookmark) >= Number(book.total_pages)) return "completed";
        return "in_progress";
    };

    const statusLabels = {
        not_started: "Not Started",
        in_progress: "In Progress",
        completed: "Completed",
    };

    const filteredBook = books.filter((book) => {
        const matchSearch =
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase());

        const matchBook = filterBook
            ? Number(book.id) === Number(filterBook)
            : true;

        const matchStatus = filterStatus
            ? getBookStatus(book) === filterStatus
            : true;

        return matchSearch && matchBook && matchStatus;
    });

    return (
        <div className="w-full px-6 py-8">
            {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}
            {success && (
                <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-600">{success}</p>
                </div>
            )}

            <div className="flex gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All status</option>
                    {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            {books.length === 0 ? (
                <div className="text-center py-24 font-poppins font-semibold text-white">
                    Ops, it's empty here
                </div>
            ) : (
                <div className="grid md:grid-cols-1 gap-4 mt-6 pt-6">
                    {filteredBook.map((book) => {
                        const isOwner = user?.id === book.added_by;
                        const hasProgress = book.bookmark && book.progress_id && user?.id === book.user_id;

                        return (
                            <div key={book.id} className="grid gap-4 items-center p-4">
                                <div className="flex flex-row gap-4 p-4">
                                    {/* cover image */}
                                    <div className="shrink-0">
                                        <Link to={`/books/${book.id}`}>
                                            <img
                                                src={book.cover_image || "/not-exist.jpg"}
                                                alt={book.title}
                                                className="h-24 w-16 object-cover rounded-xl flex-shrink-0 hover:translate-y-1"
                                                loading="lazy"
                                            />
                                        </Link>
                                    </div>

                                    {/* book title and author */}
                                    <div className="flex flex-col gap-1">
                                        <a className="hover:text-white" href="/">
                                            <div className="flex items-center gap-2">
                                                <div className="font-poppins font-semibold text-black flex gap-2">
                                                    {book.title}

                                                    <span className="font-poppins text-sm text-gray-900">
                                                        by {book.author}
                                                    </span>
                                                </div>
                                                <div className={`rounded-md px-2 py-1 text-xs font-semibold whitespace-nowrap ${
                                                    book.bookmark === book.total_pages
                                                        ? "bg-lime-400 text-lime-900"
                                                        : hasProgress
                                                        ? "bg-rose-400 text-rose-900"
                                                        : "bg-sky-400 text-sky-900"
                                                }`}>
                                                    {book.bookmark === book.total_pages ? "Completed" : hasProgress ? "In progress" : "Not started"}
                                                </div>
                                            </div>
                                        </a>

                                        {/* description */}
                                        <p className="font-poppins text-gray-700">
                                            {book.description?.length > 100 
                                                ? book.description.slice(0, 100) + "..." 
                                                : book.description}
                                        </p>

                                        {/* progress bar */}
                                        {hasProgress ? (
                                            <div className="flex flex-col gap-2 mt-1">
                                                {book.bookmark === book.total_pages ? (
                                                    <div className="rounded-md px-2 py-1 text-xs font-semibold bg-lime-400 text-lime-900">
                                                        You finish the book!
                                                    </div>
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
                                        ) : (
                                            <>
                                                {!hasProgress && (
                                                    <button
                                                        onClick={() => { 
                                                            setSelectedBook(book); 
                                                            setSelectedProgressId(book.progress_id); 
                                                        }}
                                                        className="w-50 bg-white text-sm text-blue-800 border border-blue-500 hover:border-blue-400 px-3 py-1.5 rounded-lg transition font-medium
                                                        hover:bg-blue-400 hover:text-white transition"
                                                    >
                                                        Start Reading
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* action buttons */}
                                    <div className="flex flex-row gap-2 ml-auto items-center">
                                        {book.book_url && hasProgress && (
                                            <>
                                                {book.bookmark === book.total_pages ? (
                                                    <button
                                                        onClick={() => { 
                                                            setSelectedBook(book); 
                                                            setSelectedProgressId(book.progress_id);
                                                        }}
                                                        className="w-24 bg-white text-sm text-blue-800 border border-blue-500 hover:border-blue-400 px-3 py-1.5 
                                                        rounded-lg transition font-medium hover:bg-blue-400 hover:text-white transition"
                                                    >
                                                        Reread
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => { 
                                                                setSelectedBook(book); 
                                                                setSelectedProgressId(book.progress_id);
                                                            }}
                                                            className="w-24 bg-white text-sm text-blue-800 border border-blue-500 hover:border-blue-400 px-3 py-1.5 
                                                            rounded-lg transition font-medium hover:bg-blue-400 hover:text-white transition"
                                                        >
                                                            Continue
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                        )}

                                        {isOwner && (
                                            <>
                                                <button
                                                    onClick={() => { 
                                                        setEditBook(book); 
                                                        setShowModal(true); 
                                                    }}
                                                    className="bg-blue-600 text-sm text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg transition font-medium"
                                                >
                                                    Update
                                                </button>

                                                {showModal && editBook?.id === book.id && (
                                                    <BookForm
                                                        modalTitle="Update Book"
                                                        book={editBook}
                                                        onClose={() => { 
                                                            setShowModal(false); 
                                                            setEditBook(null); 
                                                        }}
                                                    />
                                                )}

                                                <button
                                                    onClick={() => 
                                                        handleDelete(book.id)
                                                    }
                                                    className="bg-red-600 text-sm text-white hover:bg-red-700 px-3 py-1.5 rounded-lg transition font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* PDF viewer — rendered OUTSIDE the table, once at page level */}
            {selectedBook && (
                <PDFViewer
                    bookUrl={selectedBook.pdf_url}
                    bookId={selectedBook.id}
                    userId={user?.id}
                    progressId={selectedProgressId}
                    initialPage={selectedBook.bookmark || 1}
                    onClose={() => { setSelectedBook(null); setSelectedProgressId(null); }}
                />
            )}
        </div>
    );
};
