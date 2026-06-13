import axios from "axios";
import { useState } from "react";
import { HiPlus, HiDocument } from "react-icons/hi";
import Form from "./Form";

export default function BookBanner({ roles, onClose, onSuccess }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="relative">
            <img src="/users-banner-mobile.png" className="block md:hidden w-full object-cover rounded-2xl" />
            <img src="/users-banner.png" className="hidden md:block w-full h-50 object-cover rounded-2xl" />

            <div className="absolute inset-0 flex flex-col items-start text-indigo-900 pb-20 px-8">
                <h4 className="text-2xl font-semibold text-gray-900 italic">
                    "Not all those who wander are lost."
                </h4>
                <p className="font-poppins text-sm text-gray-800">
                    — J.R.R. Tolkien
                </p>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition mt-4"
                >
                    <span className="text-lg leading-none">
                        <HiPlus size={20}/>
                    </span>
                    Add Role
                </button>

                {/* modal to update role */}
                {showModal && (
                    <Form
                        modalTitle="Add role"
                        role={{}}
                        onClose={() => setShowModal(false)}
                    />
                )}
            </div>
        </div>
    );
}