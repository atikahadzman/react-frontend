import axios from "axios";
import { useState } from "react";
import { HiPlus, HiDocument } from "react-icons/hi";
import BookForm from "./Form";

export default function Banner({ onClose, onSuccess }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="relative">
            <img src="/books-banner-mobile.png" className="block md:hidden w-full object-cover rounded-2xl" />
            <img src="/books-banner.png" className="hidden md:block w-full h-50 object-cover rounded-2xl" />

            <div className="absolute inset-0 flex flex-col items-start text-white pb-20 px-8">
                <h4 className="text-2xl font-semibold italic">
                    "A reader lives a thousand lives before he dies."
                </h4>
                <p className="font-poppins text-sm">
                    — George R.R. Martin
                </p>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 border-2 border-white hover:bg-white hover:text-indigo-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition mt-4"
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