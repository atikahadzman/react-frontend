import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PDFViewer from "../pages/PDFViewer";
import CompletedProgressCard from "./CompletedProgressCard";

export default function CompletedProgress({ books, user }) {
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedProgressId, setSelectedProgressId] = useState(null);

    const completedBooks = books.filter(
        (book) => book.bookmark === book.total_pages
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const totalPages = Math.ceil(completedBooks.length / itemsPerPage);
    const currentBooks = completedBooks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <div className="flex flex-col gap-8 p-4 w-full">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">
                        Book Finished. Shelf Proud.
                    </h3>

                    {/* pagination */}
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-2 rounded ${
                                    currentPage === i + 1
                                        ? "bg-cyan-500 text-white"
                                        : "bg-slate-700 text-white hover:bg-slate-600"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* books */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6 px-6">
                    {currentBooks.map((book) => (
                        <CompletedProgressCard
                            key={book.id}
                            book={book}
                            user={user}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}