import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProgressByUser } from "../../services/progressService";
import ProgressCard from "./ProgressCard";

export default function Progress() {
    const { user } = useAuth();

    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user?.id) {
            loadBooks();
        }
    }, [user]);

    async function loadBooks() {
        try {
            const data = await getProgressByUser(user.id);
            setBooks(data);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <div className="main-card rounded-md py-5 font-poppins">
                <div className="card-body">

                    {/* error */}
                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <h3 className="text-2xl font-bold text-white">
                        Continue Reading...
                    </h3>

                    {books.length === 0 ? (
                        <div className="py-20 text-center">
                            No current books.
                        </div>
                    ) : (
                        <div className="space-y-4 mt-5">
                            {books.map((book) => (
                                <ProgressCard
                                    key={book.id}
                                    book={book}
                                    user={user}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}