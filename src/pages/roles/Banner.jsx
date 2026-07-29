import axios from "axios";
import { useState } from "react";
import { HiPlus, HiDocument } from "react-icons/hi";
import Form from "./Form";

export default function BookBanner({ roles, onClose, onSuccess }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="relative font-poppins">
            <img src="/roles-banner-mobile.png" className="block md:hidden w-full object-cover rounded-2xl" />
            <img src="/roles-banner.png" className="hidden md:block w-full h-50 object-cover rounded-2xl" />

            <div className="absolute inset-0 flex flex-col items-start text-white pb-20 px-8">
                <h4 className="text-2xl font-semibold italic">
                    "One must be a wise reader to quote wisely and well."
                </h4>
                <p className="text-sm">
                    — A.A. Milne
                </p>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 border-2 border-white hover:bg-white hover:text-blue-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition mt-4"
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