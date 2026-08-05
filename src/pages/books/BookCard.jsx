import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineInformationCircle } from "react-icons/hi"; 
import Action from "./Action";
import BookInfo from "./BookInfo";
import ProgressBar from "./ProgressBar";

export default function BookCard({ book, user, rates, onEdit, onDelete }) {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRating, setShowRating] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    const completed = book.bookmark === book.total_pages;
    const hasProgress = book.bookmark && book.progress_id && user?.id === book.user_id;
    const percent = Math.min(
        100,
        Math.round((book.bookmark / book.total_pages) * 100)
    );

    return (
        <div className="rounded-xl border bg-[#f9f3ee] p-5">
            <div className="flex flex-col gap-6 md:flex-row">
                <BookInfo 
                    book={book}
                    user={user}
                />

                <div className="flex-1">
                    {hasProgress && (
                        <ProgressBar
                            book={book}
                            user={user}
                        />
                    )}

                    {!completed && !hasProgress && (
                        <div className="flex items-center gap-3 rounded-md bg-gray-200 px-3 py-2 text-gray-900">
                            <HiOutlineInformationCircle
                                className="shrink-0 text-sky-900"
                                size={24}
                            />

                            <span className="text-sm">
                                You haven't started this book yet. Start reading today and build your reading habit!
                            </span>
                        </div>
                    )}

                    <Action
                        book={book}
                        user={user}
                    />
                </div>
            </div>
        </div>
    );
}