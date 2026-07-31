import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Banner from "./Banner";
import Progress from "./Progress";
import BookOfMonth from "./BookOfMonth";

import { useAuth } from "../../context/AuthContext";
import { getBooks, getBookOfTheMonth } from "../../services/bookService";

export default function Dashboard() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [books, setBooks] = useState([]);
    const [bookOfTheMonth, setBookOfTheMonth] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        loadBooks();
        loadBookOfTheMonth();
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

    return (
        <div className="min-h-screen w-full bg-[#1e1e2c]">
            <div className="w-full px-6 py-8">
                <Banner />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <div className="lg:col-span-2">
                        <Progress />
                    </div>


                    <div className="lg:col-span-1">
                        <BookOfMonth book={bookOfTheMonth}/>
                    </div>
                </div>
            </div>
        </div>
    );
}