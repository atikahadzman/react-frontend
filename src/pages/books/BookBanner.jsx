import axios from "axios";
import { useState } from "react";
import { HiPlus, HiDocument } from "react-icons/hi";
import BookForm from "./BookForm";

export default function BookBanner({ books, onClose, onSuccess }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="relative">
            <img src="/books-banner-mobile.png" className="block md:hidden w-full object-cover rounded-2xl" />
            <img src="/books-banner.png" className="hidden md:block w-full h-50 object-cover rounded-2xl" />

            <div className="absolute inset-0 flex flex-col justify-center items-start text-indigo-900 pl-10">
                <h4 className="text-2xl font-semibold text-gray-900 italic">
                    "A reader lives a thousand lives before he dies."
                </h4>
                <p className="font-poppins text-sm text-gray-500">
                    — George R.R. Martin
                </p>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition mt-4"
                >
                    <span className="text-lg leading-none">
                        <HiPlus size={20}/>
                    </span>
                    Add more
                </button>

                {/* modal to update book */}
                {showModal && (
                    <BookForm
                        modalTitle="Add Book"
                        book={{}}
                        onClose={() => setShowModal(false)}
                    />
                )}
            </div>
        </div>
    );
}