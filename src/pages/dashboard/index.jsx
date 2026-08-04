import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Banner from "./Banner";
import Progress from "./Progress";
import BookOfMonth from "./BookOfMonth";
import Streak from "./Streak";
import ErrorAlert from "../../alert/ErrorAlert";

import { useAuth } from "../../context/AuthContext";
import { getBooks, getBookOfTheMonth } from "../../services/bookService";
import { getReadingStreak } from "../../services/progressService";

export default function Dashboard() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [books, setBooks] = useState([]);
    const [bookOfTheMonth, setBookOfTheMonth] = useState(null);
    const [streak, setStreak] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        loadBooks();
        loadBookOfTheMonth();
        loadReadingStreak();
    }, [token]);

    const loadBooks = async () => {
        try {
            const data = await getBooks();
            setBooks(data);
        } catch (err) {
            setError("Failed to fetch books");
        }
    };
    
    const loadBookOfTheMonth = async () => {
        try {
            const data = await getBookOfTheMonth();
            setBookOfTheMonth(data);
        } catch (err) {
            setError("Failed to fetch book");
        }
    };
    
    const loadReadingStreak = async () => {
        try {
            const data = await getReadingStreak();
            setStreak(data);
        } catch (err) {
            setError("Failed to fetch reading streak");
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#1e1e2c]">
            <div className="w-full px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Banner />
                    </div>
                    <div className="lg:col-span-1">
                        <Streak streak={streak}/>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    {error && (
                        <ErrorAlert message={error}/>
                    )}
                    <div className="lg:col-span-2">
                        <Progress books={books}/>
                    </div>

                    <div className="lg:col-span-1">
                        <BookOfMonth book={bookOfTheMonth}/>
                    </div>
                </div>
            </div>
        </div>
    );
}