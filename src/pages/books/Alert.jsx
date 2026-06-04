import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { HiPhotograph, HiDocument } from "react-icons/hi";

export default function Alert({ modalTitle, id, onClose, onSuccess }) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { user, token } = useAuth();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const confirmDelete = async () => {
        setError("");
        setSuccess("");
        console.log(' === id === ' + id);

        const res = await axios.delete(apiUrl + "/books/" + id, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status == 'success') {
            onClose();
            setSuccess(res.data.message);
        } else {
            setError(res.data.message);
        }
        window.location.reload();
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-screen overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {modalTitle}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {error && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-600">{success}</p>
                    </div>
                )}

                {/* <form onSubmit={handleSubmit} className="space-y-4"> */}
                    <p className="text-gray-700">Some readers may still be reading it...</p>

                    <div className="flex flex-col gap-2 p-2">
                        <button
                            type="button"
                            onClick={() => {
                                console.log("Cancel clicked");
                                onClose();
                            }}
                            className="bg-white text-sm border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition font-medium"
                        >
                            Cancel
                        </button>
                        <button className="bg-red-600 text-sm text-white hover:bg-red-700 px-3 py-1.5 rounded-lg transition font-medium"
                            onClick={confirmDelete}
                        >
                            Yes, Delete
                        </button>
                    </div>
                {/* </form> */}
            </div>
        </div>
    );
}