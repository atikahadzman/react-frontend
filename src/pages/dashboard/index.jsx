import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Banner from "./Banner";
import Progress from "../../elements/Progress";
import BookOfMonth from "./BookOfMonth";
import Streak from "./Streak";
import ErrorAlert from "../../alert/ErrorAlert";
import CompletedProgress from "../../elements/CompletedProgress";

import { useAuth } from "../../context/AuthContext";
import { getBooks, getBookOfTheMonth } from "../../services/bookService";
import { getReadingStreak, getProgressByUser } from "../../services/progressService";

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [books, setBooks] = useState([]);
    const [bookOfTheMonth, setBookOfTheMonth] = useState(null);
    const [streak, setStreak] = useState(null);
    const [readingProgress, setProgress] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        loadBooks();
        loadBookOfTheMonth();
        loadReadingStreak();
        loadReadingProgress();
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
    
    const loadReadingProgress = async () => {
        try {
            const data = await getProgressByUser(user?.id);
            setProgress(data);
        } catch (err) {
            setError("Failed to fetch reading progress");
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
                        <Progress books={readingProgress}/>
                    </div>

                    <div className="lg:col-span-1">
                        <BookOfMonth book={bookOfTheMonth}/>
                    </div>
                </div>

                <div className="py-8">
                    <CompletedProgress 
                        books={readingProgress}
                        user={user}
                    />
                </div>
            </div>
        </div>
    );
}