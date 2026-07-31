import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PDFViewer from "../PDFViewer";

export default function ProgressCard({ book, user }) {
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedProgressId, setSelectedProgressId] = useState(null);

    const hasProgress =
        book.bookmark &&
        book.progress_id &&
        user?.id === book.user_id;

    const completed = book.bookmark === book.total_pages;

    const percent = Math.min(
        100,
        Math.round((book.bookmark / book.total_pages) * 100)
    );

    const btnLabel = completed ? "Reread" : "Continue...";

    return (
        <div className="rounded-xl bg-[#f9f3ee] border border-gray-100 p-4 shadow-sm">
            <div className="flex flex-col gap-6 p-2">
                <div className="flex flex-col items-center gap-5 rounded-md md:flex-row">

                    {/* cover image */}
                    <div className="shrink-0">
                        <Link to={`/books/${book.id}`}>
                            <img
                                src={book.cover_image_url || "/not-exist.jpg"}
                                className="w-full md:w-30 md:h-50 object-cover rounded-2xl hover:translate-x-1 transition-transform"
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
                                    className="border-2 border-indigo-900 text-indigo-900 px-3 py-3 hover:bg-white hover:text-blue-600 transition"
                                >
                                    {btnLabel}
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
        </div>
    );
}