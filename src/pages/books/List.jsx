import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BookForm from "./Form";
import Alert from "./Alert";
import Rates from "../rates/Form";
import BookCard from "./BookCard";
import FilterSearch from "./FilterSearch";
import { getRateById } from "../../services/ratesService";

export default function List({ books, onClose, onSuccess }) {
    const { user } = useAuth();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editBook, setEditBook] = useState(null);
    const [filteredBook, setFilteredBook] = useState(books);
    const [deleteBookId, setDeleteBookId] = useState("");
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
                        return (
                        <div
                            key={book.id}
                            className="flex flex-col rounded-xl bg-[#f9f3ee] border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
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
                        );
                    })}
                </div>
            )}
        </div>
    );
};
