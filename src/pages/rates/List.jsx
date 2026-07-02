import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiStar, HiOutlineStar } from "react-icons/hi"; 

export default function List({ book_id  }) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { user, token } = useAuth();
    const [rates, setRates] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchRates();
    }, [token, book_id]);

    // get all rating by book id
    const fetchRates = async () => {
        try {
            const res = await axios.get(apiUrl + "/rate/by-book-id/" + book_id, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const rating = [];
            if (res.data.data.length === 0) {
                rating = res.data.data;
            }

            console.log('list token: ' + JSON.stringify(token));
            console.log('list rates: ' + JSON.stringify(rating));
            console.log("list isArray:", Array.isArray(rating));
            console.log("list length:", rating.length);
        } catch (err) {
            if (err.response?.status !== 404) {
                setError("Failed to fetch rates");
            }
            setRates([]);
        }
    };

    return (
        <div className="w-full px-6 py-8">
            {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {rates.length === 0 ? (
                <div className="text-center py-24 font-poppins font-semibold text-white">
                    Ops, it's empty here
                </div>
            ) : (
                <>
                    {rates.map((rate) => (
                        <div key={rate.id} className="hover:bg-gray-50 transition p-4 border border-gray-100 rounded-xl mb-3">
                            <hr/>
                                <div className="flex flex-col rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow p-4">
                                    {/* stars */}
                                    <div className="font-poppins flex items-center text-md text-gray-700 gap-1 mb-2">
                                        by {rate?.user.name}
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star}>
                                                {star <= Number(rate.rating) ? (
                                                    <HiStar size={20} className="text-yellow-400" />
                                                ) : (
                                                    <HiOutlineStar size={20} className="text-gray-300" />
                                                )}
                                            </span>
                                        ))}
                                        <span className="font-poppins text-md text-gray-700 ml-1">
                                            {rate.rating} / 5
                                        </span>
                                    </div>

                                    {/* review */}
                                    {rate.review && (
                                        <p className="font-poppins text-md text-gray-700 text-italic">
                                            "{rate.review}"
                                        </p>
                                    )}
                                </div>
                            <hr/>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

