import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiBookOpen } from "react-icons/hi"; 
import PDFViewer from "../PDFViewer";

export default function BookList({ books = [], onClose, onSuccess }) {
    const [selectedProgressId, setSelectedProgressId] = useState(null);
    const { user, token } = useAuth();
    const [selectedBook, setSelectedBook] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) { 
            navigate("/login"); return; 
        }
    }, []);

    console.log('books: ' + JSON.stringify(books));
    return (
        <div className="w-full px-6 py-8">
            {/* book list */}
            {books.length === 0 ? (
                <div className="text-center py-24">
                    <div className="font-poppins font-semibold text-black">
                        Ops, it's empty here
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-1 gap-4 mt-6 pt-6">
                    {books.map((book) => (
                        <div key={book.id} className="flex flex-row gap-4 items-center p-3">
                            {/* cover image */}
                            {book.cover_image ? (
                                <img
                                    src={book.cover_image}
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
                            {book.bookmark ? (
                                <div className="flex flex-col gap-1 pl-12 w-full"> 
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
                            ) : (
                                <button
                                    onClick={() => {
                                        setSelectedBook(book);
                                        setSelectedProgressId(book.progress_id);
                                    }}
                                    className="bg-white text-sm text-blue-800 hover:text-blue-800 border border-blue-500 hover:border-blue-400 px-3 py-1.5 rounded-lg transition font-medium"
                                >
                                    Start
                                </button>
                            )}

                            {/* continue button */}
                            <div className="flex flex-col gap-1 pl-12"> 
                                <div className="flex items-center gap-2">
                                    {book.book_url && book.progress_id && (
                                    <button
                                        onClick={() => {
                                            setSelectedBook(book);
                                            setSelectedProgressId(book.progress_id);
                                        }}
                                        className="bg-white text-sm text-blue-800 hover:text-blue-800 border border-blue-500 hover:border-blue-400 px-3 py-1.5 rounded-lg transition font-medium"
                                    >
                                        Continue
                                    </button>
                                    )}


                                    {user?.id === book.added_by && (
                                        <button
                                            onClick={() => navigate(`/books/${book.id}/edit`)}
                                            className="bg-blue-600 text-sm text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg transition font-medium"
                                        >
                                            Update
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
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
                    onClose={() => {
                        setSelectedBook(null);
                        setSelectedProgressId(null);
                    }}
                />
            )}
        </div>
    );
};
