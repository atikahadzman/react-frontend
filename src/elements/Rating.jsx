import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { HiStar, HiOutlineStar } from "react-icons/hi";

export default function Rating({ id, rates }) {
    const [showRating, setShowRating] = useState(false);

    return (
        <div>
            {rates[id] ? (
                <div className="flex justify-center items-center gap-1">
                    <span className="text-gray-200">Rated by you</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                            {star <= rates[id].rating ? (
                                <HiStar size={20} className="text-yellow-400" />
                            ) : (
                                <HiOutlineStar size={20} className="text-gray-300" />
                            )}
                        </span>
                    ))}
                    <span className="text-xs text-yellow-500 ml-1">
                        {rates[id].rating} / 5
                    </span>
                    <button
                        onClick={() => setShowRating(true)}
                        className="ml-2 text-xs text-yellow-600 hover:underline"
                    >
                        Edit
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setShowRating(true)}
                    className="flex items-center gap-2 hover:bg-gray-100 text-gray-700 text-sm font-medium transition"
                >
                    <span className="text-lg leading-none">
                        <HiOutlineStar size={20} />
                    </span>
                    Rate this book!
                </button>
            )}
        </div>
    );
}