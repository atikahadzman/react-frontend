import { useEffect, useState } from "react";
import BookForm from "./Form";
import Alert from "./Alert";
import PDFViewer from "../PDFViewer";

export default function Action({ book, user }) {
    const [editBook, setEditBook] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteBookId, setDeleteBookId] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedProgressId, setSelectedProgressId] = useState(null);

    const isOwner = user?.id === book.added_by;
    const completed = book.bookmark === book.total_pages;
    const hasProgress = book.bookmark && book.progress_id && user?.id === book.user_id;
    const btnLabel = completed ? "Reread" : hasProgress ? "Continue..." : "Start Reading";

    const handleDeleteClick = (id) => {
        setShowDeleteModal(true);
    };

    const openReader = () => {
        setSelectedBook(book);
    };

    return (
        <div className="mt-5 flex flex-wrap justify-center items-center gap-3">
            <button
                onClick={() => { 
                    setSelectedBook(book); 
                    setSelectedProgressId(book.progress_id); 
                }}
                className="border-2 border-indigo-900 px-5 py-2 text-indigo-900 hover:bg-indigo-900 hover:text-white transition"
            >
                {btnLabel}
            </button>

            {isOwner && (
                <>
                    <button
                        onClick={() => {
                            setEditBook(book);
                            setShowModal(true);
                        }}
                        className="border-2 border-blue-900 px-5 py-2 text-blue-900 hover:bg-blue-900 hover:text-white transition"
                    >
                        Update
                    </button>

                    <button
                        onClick={() => {
                            handleDeleteClick(book.id);
                            setDeleteBookId(book.id);
                        }}
                        className="border-2 border-red-900 px-5 py-2 text-red-900 hover:bg-red-900 hover:text-white transition"
                    >
                        Delete
                    </button>
                </>
            )}

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

            {showDeleteModal && (
                <Alert
                    modalTitle="Are you sure you want to delete this book?"
                    id={deleteBookId}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}

            {selectedBook && (
                <PDFViewer
                    bookUrl={selectedBook.pdf_url}
                    bookId={selectedBook.id}
                    userId={user.id}
                    progressId={selectedBook.progress_id}
                    initialPage={
                        completed ? 1 : selectedBook.bookmark
                    }
                    onClose={() => setSelectedBook(null)}
                />
            )}
        </div>
    );
}