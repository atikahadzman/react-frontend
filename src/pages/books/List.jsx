import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiBookOpen, HiX, HiStar, HiOutlineStar } from "react-icons/hi"; 
import PDFViewer from "../PDFViewer";
import BookForm from "./Form";
import Alert from "./Alert";
import Rates from "../rates/Form";
import FilterSearch from "./FilterSearch";
import { getRateById } from "../../services/ratesService";

export default function List({ books, onClose, onSuccess }) {
    const [selectedProgressId, setSelectedProgressId] = useState(null);
    const { user, token } = useAuth();
    const [selectedBook, setSelectedBook] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editBook, setEditBook] = useState(null);
    const [filteredBook, setFilteredBook] = useState(books);
    const [deleteBookId, setDeleteBookId] = useState("");
    const [showRating, setShowRating] = useState(false);
    const [rates, setRates] = useState({});
    const navigate = useNavigate();
    const userId = user?.id;

    useEffect(() => {
        setFilteredBook(books);

        const loadRates = async () => {
            const completedBooks = books.filter(
                (book) => book.bookmark === book.total_pages
            );

            for (const book of completedBooks) {
                await fetchRates(book.id);
            }
        };
        
    }, [books]);

    const fetchRates = async (bookId) => {
        try {
            const data = await getRateById(userId);

            setRates((prev) => ({
                ...prev,
                [bookId]: data
            }));

        } catch (err) {
            console.error("Failed to fetch rate", err);
        }
    };

    const handleDeleteClick = (id) => {
        setShowDeleteModal(true);
    };

    return (
        <div className="w-full px-6 py-8">
            <FilterSearch 
                books={books}
                onFilter={setFilteredBook}
            />

            {books.length === 0 ? (
                <div className="text-center py-24 font-poppins font-semibold text-white">
                    Ops, it's empty here
                </div>
            ) : (
                <div className="rounded-xl flex flex-col gap-6 overflow-hidden">
                    {filteredBook.map((book) => {
                        const isOwner = user?.id === book.added_by;
                        const hasProgress = book.bookmark && book.progress_id && user?.id === book.user_id;
                        const btnLabel = book.bookmark === book.total_pages ? "Reread" : "Continue...";

                        return (
                            <div className="flex flex-col rounded-xl bg-[#f9f3ee] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div key={book.id} className="flex flex-col gap-6 mb-5">
                                    <div className="flex flex-col items-center gap-x-8 rounded-md p-3 md:flex-row">
                                        {/* cover image */}
                                        <div className="shrink-0">
                                            <Link to={`/books/${book.id}`}>
                                                {/* mobile */}
                                                <img
                                                    src={book.cover_image || "/not-exist.jpg"}
                                                    className="block md:hidden w-50 object-cover rounded-2xl hover:translate-x-1 transition-transform"
                                                    alt={book.title}
                                                    loading="lazy"
                                                />
                                                {/* desktop */}
                                                <img
                                                    src={book.cover_image || "/not-exist.jpg"}
                                                    className="hidden md:block w-30 h-50 object-cover rounded-2xl p-2 hover:translate-x-1 transition-transform"
                                                    alt={book.title}
                                                    loading="lazy"
                                                />
                                            </Link>
                                        </div>

                                        {/* title and progress bar */}
                                        <div>
                                            <div className="flex flex-col items-center gap-y-2 md:flex-row">
                                                <Link className="hover:text-cyan-400" to={`/books/${book.id}`}>
                                                    <div className="text-xl font-semibold text-indigo-900 hover:translate-x-1 transition-transform mb-2">
                                                        {book.title}
                                                    </div>
                                                </Link>
                                                <div className="ml-3 flex flex-wrap gap-2">
                                                    <span className="text-sm text-gray-500">by {book.author}</span>
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
                                            </div>

                                            {/* description */}
                                            <p className="mt-3 text-gray-700">
                                                {book.description?.length > 100
                                                    ? book.description.slice(0, 100) + "..."
                                                    : book.description}
                                            </p>

                                            {/* progress bar */}
                                            {hasProgress ? (
                                                <div className="flex flex-col gap-2 mt-1">
                                                    {book.bookmark === book.total_pages ? (
                                                        <>
                                                            <div className="rounded-md px-2 py-1 text-xs font-semibold bg-lime-400 text-lime-900">
                                                                You finish the book!
                                                            </div>

                                                            {/* has rating — show stars */}
                                                            {rates[book.id] ? (
                                                                <div className="flex items-center gap-1">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <span key={star}>
                                                                            {star <= rates[book.id].rating ? (
                                                                                <HiStar size={20} className="text-yellow-400" />
                                                                            ) : (
                                                                                <HiOutlineStar size={20} className="text-gray-300" />
                                                                            )}
                                                                        </span>
                                                                    ))}
                                                                    <span className="text-xs text-gray-500 ml-1">
                                                                        {rates[book.id].rating} / 5
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

                                                            {showRating && (
                                                                <Rates
                                                                    rates={rates[book.id]}
                                                                    id={book.id}
                                                                    onClose={() => setShowRating(false)}
                                                                />
                                                            )}
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
                                            ) : (
                                                    <>
                                                        {!hasProgress && (
                                                            <button
                                                                onClick={() => { 
                                                                    setSelectedBook(book); 
                                                                    setSelectedProgressId(book.progress_id); 
                                                                }}
                                                                className="border-2 border-indigo-900 text-indigo-900 px-6 py-3 hover:bg-white hover:text-blue-600 transition"
                                                            >
                                                                Start Reading
                                                            </button>
                                                        )}
                                                    </>
                                            )}
                                        </div>

                                        {/* action buttons */}
                                        <div className="flex items-center gap-2 mt-3">
                                            {book.book_url && hasProgress && (
                                                <>
                                                    {book.bookmark === book.total_pages ? (
                                                        <button
                                                            onClick={() => { 
                                                                setSelectedBook(book); 
                                                                setSelectedProgressId(book?.progress_id);
                                                            }}
                                                            className="border-2 border-indigo-900 text-indigo-900 px-6 py-3 hover:bg-white hover:text-blue-600 transition"
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
                                                                className="w-24 bg-white text-sm text-blue-800 border border-blue-500 hover:border-blue-400 px-3 py-1.5 rounded-lg transition font-medium"
                                                            >
                                                                {btnLabel}
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
                                                        className="border-2 border-blue-900 hover:bg-blue-900 hover:text-white text-indigo-900 text-sm px-3 py-1.5 rounded-lg transition mt-4"
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
                                                        onClick={() => {
                                                            handleDeleteClick(book.id);
                                                            setDeleteBookId(book.id);
                                                        }}
                                                        className="border-2 border-red-900 hover:bg-red-900 hover:text-white text-red-900 text-sm px-3 py-1.5 rounded-lg transition mt-4"
                                                    >
                                                        Delete
                                                    </button>

                                                    {showDeleteModal && (
                                                        <Alert
                                                            modalTitle="Are you sure you want to delete this book?"
                                                            id={deleteBookId}
                                                            onClose={() => setShowDeleteModal(false)}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </div>
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
                    userId={user.id}
                    progressId={selectedBook.progress_id}
                    initialPage={
                        selectedBook.bookmark === selectedBook.total_pages
                            ? 1
                            : selectedBook.bookmark
                    }
                    onClose={() => setSelectedBook(null)}
                />
            )}
        </div>
    );
};
