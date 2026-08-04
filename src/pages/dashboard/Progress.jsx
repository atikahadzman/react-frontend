import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProgressByUser } from "../../services/progressService";
import ProgressCard from "./ProgressCard";

export default function Progress({ books }) {
    const { user } = useAuth();

    return (
        <>
            <div className="main-card rounded-md py-5 font-poppins">
                <div className="card-body">

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