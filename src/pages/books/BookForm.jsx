import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { HiPhotograph, HiDocument } from "react-icons/hi";
import { Document, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
).toString();

export default function BookForm({ modalTitle, book = [], onClose, onSuccess }) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { user, token } = useAuth();
    const [form, setForm] = useState({
        title: book?.title || "",
        author: book?.author || "",
        description: book?.description || "",
        total_pages: book?.total_pages || "",
        cover_image: null,
        book_url: null,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = async (e) => {
        const { name, type, files, value } = e.target;

        if (type === "file") {
            const file = files?.[0];
            setForm((prev) => ({ ...prev, [name]: file }));

            if (name === "book_url" && file) {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
                    setForm((prev) => ({ ...prev, total_pages: pdf.numPages }));
                } catch (err) {
                    console.error("Failed to read PDF pages", err);
                }
            }
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        setSaving(true);
        setError("");

        if (!form.book_url) {
            setError("PDF file is required");
            setSaving(false);
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("author", form.author);
        formData.append("description", form.description);
        formData.append("total_pages", form.total_pages);
        if (form.cover_image instanceof File) {
            formData.append("cover_image", form.cover_image);
        }
        if (form.book_url instanceof File) {
            formData.append("book_url", form.book_url);
        }

        const isEditing = !!book?.id;
        const url = isEditing ? `${apiUrl}/books/${book.id}` : `${apiUrl}/books`;

        if (isEditing) {
            formData.append("_method", "PUT");
        }

        const res = await axios.post(url, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        if (res.data.status === "success") {
            // onSuccess();
            onClose();
        } else {
            setError(JSON.stringify(res));
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
                            Cover image
                        </label>
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition overflow-hidden">
                            {form.cover_image instanceof File ? (
                                // Newly selected file — show local preview
                                <img
                                    src={URL.createObjectURL(form.cover_image)}
                                    alt="Cover preview"
                                    className="h-24 w-16 object-cover rounded-xl flex-shrink-0"
                                />
                            ) : form.cover_image ? (
                                // Existing image from server — show URL directly
                                <img
                                    src={form.cover_image}
                                    alt="Cover preview"
                                    className="h-24 w-16 object-cover rounded-xl flex-shrink-0"
                                />
                            ) : (
                                // No image
                                <>
                                    <HiPhotograph size={20} />
                                    <span className="text-xs text-gray-500 mt-1">Click to upload image</span>
                                </>
                            )}
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
                                {form.book_url instanceof File
                                    ? form.book_url.name
                                    : form.book_url
                                    ? "Current file: " + form.book_url.split("/").pop()
                                    : "Click to upload PDF"}
                            </span>
                            <input type="file" name="book_url" accept=".pdf" onChange={handleChange} className="hidden" />
                        </label>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 cursor-not-allowed"
                            readOnly
                        />
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