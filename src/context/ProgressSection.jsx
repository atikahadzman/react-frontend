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
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-gray-100">
                                {books.map((book) => {
                                    const hasProgress = book.bookmark && book.progress_id && user?.id === book.user_id;
                                    
                                    return (
                                        <tr key={book.id} className="hover:bg-gray-50 transition">
                                            {/* cover */}
                                            <td className="px-4 py-3">
                                                {book.cover_image_url && (
                                                    <Link to={`/books/${book.id}`}>
                                                        <img
                                                            src={book.cover_image_url}
                                                            alt={book.title}
                                                            className="h-30 w-30 object-cover rounded-xl flex-shrink-0 hover:translate-y-1"
                                                            loading="lazy"
                                                        />
                                                    </Link>
                                                )}
                                            </td>

                                            {/* title */}
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-indigo-900">{book.title}</p>
                                                        <div className={`w-fit rounded-md px-2 py-1 text-xs font-semibold whitespace-nowrap ${
                                                            book.bookmark === book.total_pages
                                                                ? "bg-lime-400 text-lime-900"
                                                                : hasProgress
                                                                ? "bg-rose-400 text-rose-900"
                                                                : "bg-sky-400 text-sky-900"
                                                        }`}>
                                                            {book.bookmark === book.total_pages ? "Completed" : hasProgress ? "In progress" : "Not started"}
                                                        </div>
                                                    </div>

                                                    {book.bookmark && (
                                                        <div className="text-xs text-gray-700 mt-0.5 line-clamp-1">
                                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                                <span>{book.bookmark || 0} / {book.total_pages} pages</span>
                                                                <span>
                                                                    {Math.min(
                                                                        100,
                                                                        Math.round(((book.bookmark || 0) / book.total_pages) * 100)
                                                                    )}%
                                                                </span>
                                                            </div>
                                                            <div className="rounded-md bg-gray-200 overflow-hidden h-6">
                                                                <div
                                                                    className="bg-lime-400 h-full rounded-md transition-all"
                                                                    style={{ width: `${Math.min(100, (book.bookmark / book.total_pages) * 100)}%` }}
                                                                />
                                                            </div>
                                                            {book.last_read_at}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* actions */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {book.book_url && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBook(book);
                                                            setSelectedProgressId(book.progress_id);
                                                        }}
                                                        className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1.5 
                                                        rounded-lg transition font-medium whitespace-nowrap hover:bg-blue-400 hover:text-white transition"
                                                    >
                                                        Continue...
                                                    </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
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