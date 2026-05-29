import axios from "axios";
import { useState } from "react";
import { HiPlus, HiDocument } from "react-icons/hi";

export default function ProgressBanner({ books, onClose, onSuccess }) {
    return (
        <div className="relative">
            <img src="/books-banner.png" className="hidden md:block w-full h-45 object-cover rounded-2xl" />

            <div className="absolute inset-0 flex flex-col justify-center items-center text-indigo-900">
                <h3 className="text-2xl font-semibold text-gray-900">
                    {books.length} {books.length === 1 ? "book" : "books"} in your library
                </h3>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
                >
                <span className="text-lg leading-none">
                    <HiPlus size={20}/>
                </span>
                    Add more
                </button>
            </div>
        </div>
    );
}