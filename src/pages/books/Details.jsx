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
import Description from "./Description";

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
                <Description
                    books={books}
                />

                {/* rating by current user */}
                <div className="flex flex-col items-center md:flex-row md:justify-between md:gap-x-24">
                    <Rating
                        id={id}
                        rates={rates}
                    />
                </div>

                {/* rating by all reader */}
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