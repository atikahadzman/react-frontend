import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PDFViewer from "../pages/PDFViewer";
import { useAuth } from "../context/AuthContext";
import { HiPhotograph, HiDocument } from "react-icons/hi";  

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

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const data = new FormData();
            data.append("title", form.title);
            data.append("author", form.author);
            data.append("description", form.description);
            data.append("total_pages", form.total_pages);
            if (form.cover_image) {
                data.append("cover_image", form.cover_image);
            }

            if (form.book_url) {
                data.append("book_url", form.book_url);
            }

            await axios.post(apiUrl + "/books", data, {
                headers: {
                Authorization:  `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setShowModal(false);
            setForm({
                title: "", 
                author: "", 
                description: "",
                total_pages: "", 
                cover_image: null, 
                book_url: null,
            });
            fetchBooks();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add book");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <div className="w-full px-6 py-8">

            {/* header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-semibold text-gray-900">Books</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {books.length} {books.length === 1 ? "book" : "books"} in your library
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
                >
                    <span className="text-lg leading-none">+</span>
                    Add book
                </button>
            </div>

            {/* error */}
            {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
            </div>
            )}

            {/* if books empty */}
            {books.length === 0 ? (
            <div className="text-center py-24">
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No books yet</h3>
                <p className="text-sm text-gray-500 mb-6">Add your first book to get started</p>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
                >
                    Add your first book
                </button>
            </div>
            ) : (

            /* book table */
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Cover</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide w-64">Progress</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide w-64">Last read at</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {books.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 transition">

                        {/* cover */}
                        <td className="px-4 py-3">
                            {book.cover_image_url ? (
                                <img
                                    src={book.cover_image_url}
                                    alt={book.title}
                                    className="w-12 h-16 object-cover rounded-md"
                                />
                            ) : (
                                <img src="/not-exist.jpg" alt="No cover" className="w-12 h-16 object-cover rounded-md" />
                            )}
                        </td>

                        {/* title */}
                        <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{book.title}</p>
                            {book.description && (
                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                {book.description}
                                </p>
                            )}
                        </td>

                        {/* progress bar */}
                        <td className="px-4 py-3 w-64">
                            {book.total_pages ? (
                                <div>
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
                                </div>
                            ) : (
                                <span className="text-xs text-gray-400">No data</span>
                            )}
                        </td>

                        {/* last read at */}
                        <td className="px-4 py-3 text-gray-600">
                            {book.last_read_at}
                        </td>

                        {/* actions */}
                        <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                                {book.pdf_url && (
                                    <button
                                        onClick={() => {
                                            setSelectedBook(book);
                                            setSelectedProgressId(book.progress_id);
                                        }}
                                        className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-lg transition font-medium whitespace-nowrap"
                                    >
                                        Read PDF
                                    </button>
                                )}

                                <button
                                    className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition font-medium whitespace-nowrap"
                                >
                                    Update
                                </button>
                            </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </div>

        {/* PDF viewer — rendered OUTSIDE the table, once at page level */}
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

        {/* book modal */}
        {showModal && (
            <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
                onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
            >
                <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-screen overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Add new book</h2>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                        >
                            &times;
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title <span className="text-red-400">*</span>
                            </label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                placeholder="Book title"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Author <span className="text-red-400">*</span>
                            </label>
                            <input
                                name="author"
                                value={form.author}
                                onChange={handleChange}
                                required
                                placeholder="Author name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Short description..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total pages
                            </label>
                            <input
                                name="total_pages"
                                type="number"
                                value={form.total_pages}
                                onChange={handleChange}
                                placeholder="e.g. 320"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cover image
                            </label>
                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                            <span className="text-2xl mb-1">
                                <HiPhotograph size={20}/>
                            </span>
                            <span className="text-xs text-gray-500">
                                {form.cover_image ? form.cover_image.name : "Click to upload image"}
                            </span>
                            <input
                                type="file"
                                name="cover_image"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                            />
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                PDF file
                            </label>
                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                            <span className="text-2xl mb-1">
                                <HiDocument size={20}/>
                            </span>
                            <span className="text-xs text-gray-500">
                                {form.book_url ? form.book_url.name : "Click to upload PDF"}
                            </span>
                            <input
                                type="file"
                                name="book_url"
                                accept=".pdf"
                                onChange={handleChange}
                                className="hidden"
                            />
                            </label>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition"
                            >
                            {saving ? "Saving..." : "Save book"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </div>
    );
};

export default Books;