import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Banner from "./Banner";
import Progress from "./Progress";
import BookOfMonth from "./BookOfMonth";

import { useAuth } from "../../context/AuthContext";
import { Books } from "../../services/bookService";

export default function Dashboard() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [books, setBooks] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        loadBooks();
    }, [token]);

    const loadBooks = async () => {
        try {
            const data = await Books();
            setBooks(data);
        } catch (err) {
            setError("Failed to fetch books");
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#1e1e2c]">
            <div className="w-full px-6 py-8">
                <Banner />
                
                {/* <div className="flex flex-col gap-6 mt-6 pt-6">
                    <Progress books={books}/>
                </div> */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

                {/* Progress takes 2 columns */}
                <div className="lg:col-span-2">
                    <Progress />
                </div>


                {/* Book of month takes 1 column */}
                <div className="lg:col-span-1">
                    <BookOfMonth />
                </div>

            </div>
            </div>
        </div>
    );
}