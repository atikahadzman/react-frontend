import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiArrowLeft, HiStar, HiOutlineStar } from "react-icons/hi"; 
import { getBookById } from "../../services/bookService";
import { getRateByBookId } from "../../services/ratesService";
import BackButton from "../../elements/BackButton";
import Loading from "../../elements/Loading";
import Rating from "../../elements/Rating";
import ErrorAlert from "../../alert/ErrorAlert";
import RateList from "../rates/List";

const Details = () => {
    const { id } = useParams();
    const location = useLocation();
    const { user, token } = useAuth();
    const [books, setBooks] = useState(null);
    const [error, setError] = useState("");
    const [showRating, setShowRating] = useState(false);
    const [rates, setRates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchBooks();
        fetchRates();
    }, [token]);
    
    const fetchBooks = async () => {
        try {
            const data = await getBookById(id);
            setBooks(data);
        } catch (err) {
            setError("Failed to fetch book");
        }
    };

    const fetchRates = async () => {
        try {
            const data = await getRateByBookId(id);

            setRates((prev) => ({
                ...prev,
                [id]: data
            }));

        } catch (err) {
            console.error("Failed to fetch rate", err);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#1e1e2c]">
            <div className="mx-auto max-w-screen-lg px-3 py-6">

                <BackButton />

                {/* error */}
                {error && (
                    <ErrorAlert message={error}/>
                )}

                {!books && (
                    <Loading />
                )}

                {/* book information */}
                <div className="text-white flex flex-col items-center md:flex-row md:justify-between md:gap-x-24">
                    <div className="shrink-0">
                        <img
                            src={books?.cover_image || "/not-exist.jpg"}
                            alt={books?.title}
                            className="h-80 w-64 hover:translate-y-1 rounded-xl"
                            loading="lazy"
                        />
                    </div>
                    <div>
                        <h1 className="font-poppins text-[#fce4ec] text-3xl font-bold">
                            {books?.title}
                        </h1>

                        <div className="flex justify-center items-center gap-2">
                            <h4 className="font-poppins text-3xl font-bold text-gray-400">
                                by {books?.author}
                            </h4>

                            <div
                                className={`w-fit rounded-md px-2 py-1 text-sm font-semibold whitespace-nowrap ${
                                    books?.status == 1
                                        ? "bg-lime-400 text-lime-900"
                                        : "bg-rose-400 text-rose-900"
                                }`}
                            >
                                {books?.status == 1 ? "Enabled" : "Disabled"}
                            </div>
                        </div>

                        <p className="mt-6 text-xl pt-6">
                            {books?.description}
                        </p>

                        <div className="mt-6 text-lg pt-6">
                            Uploaded by <span className="font-bold">
                                {books?.user?.name}
                            </span> &nbsp;
                            <div className="inline-block h-3 border-l-2 border-red-600 mr-2"></div>
                            {books?.total_pages} pages
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center md:flex-row md:justify-between md:gap-x-24">
                    <Rating
                        id={id}
                        rates={rates}
                    />
                </div>

                <div className="flex flex-col items-center md:flex-row md:gap-x-24">
                    <RateList
                        book_id={id} 
                    />
                </div>
            </div>
        </div>
    );
};

export default Details;