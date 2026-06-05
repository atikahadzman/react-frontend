import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { HiStar, HiOutlineStar } from "react-icons/hi";

export default function Form({ rates, id, onClose }) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { token } = useAuth();
    const [form, setForm] = useState({
        rating: rates?.rating || 0,
        review: rates?.review || "",
    });
    const [hovered, setHovered] = useState(0);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        setSaving(true);
        setError("");

        if (!form.rating) {
            setError("Please select a rating.");
            setSaving(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("rating", form.rating);
            formData.append("review", form.review);
            formData.append("book_id", id); // use the id prop

            const isEditing = !!rates?.id;
            const url = isEditing
                ? `${apiUrl}/rate/${rates.id}`
                : `${apiUrl}/rate`;

            if (isEditing) formData.append("_method", "PUT");

            const res = await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.data.status === "success") {
                setSuccess(res.data.message);
                setTimeout(() => {
                    onClose();
                    window.location.reload();
                }, 1000);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-screen overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        How was the experience reading this book?
                    </h2>
                    <button
                        type="button"
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Star Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Rating
                        </label>
                        <div className="flex gap-1 justify-center item-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
                                    onMouseEnter={() => setHovered(star)}
                                    onMouseLeave={() => setHovered(0)}
                                    className="transition"
                                >
                                    {star <= (hovered || form.rating) ? (
                                        <HiStar size={40} className="text-yellow-400" />
                                    ) : (
                                        <HiOutlineStar size={40} className="text-gray-300" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your comment
                        </label>
                        <textarea
                            name="review"
                            value={form.review}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Leave some comment..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                        >
                            Skip
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition"
                        >
                            {saving ? "Saving..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}