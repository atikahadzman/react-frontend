import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PDFViewer from "../pages/PDFViewer";
import ProgressCard from "./ProgressCard";

export default function Progress({ books = [] }) {
    const { user } = useAuth();
    const [selectedBook, setSelectedBook] = useState(null);
    const readingBooks = books.filter(
        (book) => book.bookmark < book.total_pages
    );

    if (readingBooks.length === 0) {
        return (
            <div className="main-card rounded-md py-5 font-poppins">
                <div className="card-body">
                    <h3 className="text-2xl font-bold text-white">
                        Your Brain Ordered Another Chapter.
                    </h3>

                    <div className="py-20 text-center text-white">
                        No books currently being read.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-card rounded-md py-5 font-poppins">
            <div className="card-body">

                <h3 className="text-2xl font-bold text-white mb-6">
                    Your Brain Ordered Another Chapter.
                </h3>

                <div className="space-y-5">
                    {readingBooks.map((book) => (
                        <ProgressCard
                            key={book.id}
                            book={book}
                            user={user}
                            onRead={() => setSelectedBook(book)}
                        />
                    ))}
                </div>

                {selectedBook && (
                    <PDFViewer
                        bookUrl={selectedBook.pdf_url}
                        bookId={selectedBook.id}
                        userId={user.id}
                        progressId={selectedBook.progress_id}
                        initialPage={selectedBook.bookmark}
                        onClose={() => setSelectedBook(null)}
                    />
                )}
            </div>
        </div>
    );
}