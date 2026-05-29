import axios from "axios";
import { useState } from "react";
import { HiPhotograph, HiDocument } from "react-icons/hi";

export default function BookForm({ token, apiUrl, onClose, onSuccess }) {
    const [form, setForm] = useState({
        title: "",
        author: "",
        description: "",
        total_pages: "",
        cover_image: null,
        book_url: null,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const data = new FormData();
            data.append("title", form.title);
            data.append("author", form.author);
            data.append("description", form.description);
            data.append("total_pages", form.total_pages);
            if (form.cover_image) data.append("cover_image", form.cover_image);
            if (form.book_url) data.append("book_url", form.book_url);

            await axios.post(apiUrl + "/books", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            onSuccess(); // refresh book list
            onClose();  // close modal
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add book");
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
                    <h2 className="text-lg font-semibold text-gray-900">Add book</h2>
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            placeholder="Book title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Author <span className="text-red-400">*</span>
                        </label>
                        <input
                            name="author"
                            value={form.author}
                            onChange={handleChange}
                            required
                            placeholder="Author name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Short description..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total pages
                        </label>
                        <input
                            name="total_pages"
                            type="number"
                            value={form.total_pages}
                            onChange={handleChange}
                            placeholder="e.g. 320"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cover image
                        </label>
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                            <HiPhotograph size={20} />
                            <span className="text-xs text-gray-500 mt-1">
                                {form.cover_image ? form.cover_image.name : "Click to upload image"}
                            </span>
                            <input type="file" name="cover_image" accept="image/*" onChange={handleChange} className="hidden" />
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            PDF file
                        </label>
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                            <HiDocument size={20} />
                            <span className="text-xs text-gray-500 mt-1">
                                {form.book_url ? form.book_url.name : "Click to upload PDF"}
                            </span>
                            <input type="file" name="book_url" accept=".pdf" onChange={handleChange} className="hidden" />
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
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