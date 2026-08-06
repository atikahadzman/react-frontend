import React, { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import BookForm from "./Form";
import Alert from "./Alert";
import BookCard from "./BookCard";
import FilterSearch from "./FilterSearch";
import { getRateById } from "../../services/ratesService";

export default function List({ books }) {
    const { user } = useAuth();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editBook, setEditBook] = useState(null);
    const [deleteBookId, setDeleteBookId] = useState("");
    const [filteredBook, setFilteredBook] = useState([]);
    const [rates, setRates] = useState({});
    const userId = user?.id;

    // initialize books
    useEffect(() => {
        setFilteredBook(books);
    }, [books]);


    // reset pagination after filter
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredBook]);


    // load ratings
    useEffect(() => {
        if (!books.length || !userId) return;

        const loadRates = async () => {
            const completedBooks = books.filter(
                (book) => book.bookmark === book.total_pages
            );

            for (const book of completedBooks) {
                await fetchRates(book.id);
            }
        };
        loadRates();
    }, [books, userId]);

    const fetchRates = async (bookId) => {
        try {
            const data = await getRateById(userId);

            setRates((prev) => ({
                ...prev,
                [bookId]: data,
            }));

        } catch (error) {
            console.error("Failed to fetch rate:", error);
        }
    };

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 4;
    const totalPages = Math.ceil(filteredBook.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedBooks = filteredBook.slice(
        startIndex,
        startIndex + PAGE_SIZE
    );

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="w-full px-6 py-8">
            <FilterSearch
                books={books}
                onFilter={setFilteredBook}
            />

            {paginatedBooks.length === 0 ? (
                <div className="text-center py-24 font-poppins font-semibold text-white">
                    Oops, it's empty here
                </div>
            ) : (
                <div className="rounded-xl flex flex-col gap-6 overflow-hidden">
                    {paginatedBooks.map((book) => (
                        <div
                            key={book.id}
                            className="flex flex-col rounded-xl bg-[#f9f3ee] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <BookCard
                                book={book}
                                user={user}
                                rates={rates}
                                onEdit={(book)=>{
                                    setEditBook(book);
                                    setShowModal(true);
                                }}
                                onDelete={(book)=>{
                                    setDeleteBookId(book.id);
                                    setShowDeleteModal(true);
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {filteredBook.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E5E5] text-gray-200">
                    <span className="text-sm">
                        Showing{" "}
                        {startIndex + 1}
                        –
                        {Math.min(startIndex + PAGE_SIZE, filteredBook.length )}
                        {" "}of{" "}
                        {filteredBook.length}
                    </span>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition"
                            aria-label="Previous page"
                        >
                            <HiChevronLeft size={18} />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`w-8 h-8 rounded-lg text-sm transition ${
                                    page === currentPage
                                        ? "bg-[#0052CC] text-white font-regular"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition"
                            aria-label="Next page"
                        >
                            <HiChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}