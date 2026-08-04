import axios from "axios";
import { useState } from "react";
import { HiPlus, HiDocument } from "react-icons/hi";
import Form from "./Form";

export default function BookBanner({ users, roles, onClose, onSuccess, onError }) {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");

    return (
        <div className="relative">
            <img src="/users-banner-mobile.png" className="block md:hidden w-full object-cover rounded-2xl" />
            <img src="/users-banner.png" className="hidden md:block w-full h-50 object-cover rounded-2xl" />

            <div className="absolute inset-0 flex flex-col items-start text-white pb-20 px-8">
                <h4 className="text-2xl font-semibold italic">
                    "Not all those who wander are lost."
                </h4>
                <p className="font-poppins text-sm">
                    — J.R.R. Tolkien
                </p>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 border-2 border-white hover:bg-white hover:text-blue-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition mt-4"
                >
                    <span className="text-lg leading-none">
                        <HiPlus size={20}/>
                    </span>
                    Add user
                </button>

                {/* modal to update user */}
                {showModal && (
                    <Form
                        modalTitle="Add user"
                        user={{}}
                        roles={roles}
                        onClose={() => setShowModal(false)}
                        onError={setError}
                    />
                )}
            </div>
        </div>
    );
}