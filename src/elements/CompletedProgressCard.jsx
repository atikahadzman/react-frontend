import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PDFViewer from "../pages/PDFViewer";

export default function CompletedProgressCard({ book, user }) {
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedProgressId, setSelectedProgressId] = useState(null);

    return (
        <div
            key={book.id}
            className="overflow-hidden rounded-2xl bg-[#f9f3ee] hover:shadow-xl transition-all"
        >
            <div className="p-6">
                <Link to={`/books/${book.id}`}>
                    <img
                        src={book.cover_image_url || "/not-exist.jpg"}
                        className="w-full md:w-30 md:h-50 object-cover rounded-2xl hover:translate-x-1 transition-transform"
                        alt={book.title}
                        loading="lazy"
                    />
                </Link>
                <p className="text-xl font-semibold text-indigo-900 hover:translate-x-1 transition-transform">
                    {book.title}
                </p>

                <div className="flex flex-col gap-2 mt-1">
                    <div className="rounded-md px-2 py-1 text-xs font-semibold bg-lime-400 text-lime-900">
                        You finish the book!
                    </div>
                
                    <div className="font-poppins text-xs text-gray-700">
                        Last read at {book.last_read_at}
                    </div>

                    <div className="flex justify-center items-center gap-2 mt-4">
                        {book.book_url && (
                            <button
                                onClick={() => {
                                    setSelectedBook(book);
                                    setSelectedProgressId(book.progress_id);
                                }}
                                className="border-2 border-indigo-900 text-indigo-900 px-5 py-2 hover:bg-indigo-900 hover:text-white transition"
                            >
                                Reread
                            </button>
                        )}
                    </div>
                </div>
            </div>

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
}