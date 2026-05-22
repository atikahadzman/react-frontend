import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PDFViewer from "../pages/PDFViewer";
import Navbar from "../layout/Navbar";
import { useAuth } from "../context/AuthContext";

const Progress = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const mediaUrl = import.meta.env.VITE_MEDIA_URL;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [selectedProgressId, setSelectedProgressId] = useState(null);
  const { user, token } = useAuth();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    total_pages: "",
    cover_image: null,
    book_url: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(apiUrl + "/progress/by-user", {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          user_id: user?.id,
        },
      });

      const mapped = res.data.map((progress) => ({
        ...progress.book,
        current_pages: progress.current_pages,
        progress_id: progress.id,
      }));

      setBooks(mapped);
    } catch {
      setError("Failed to fetch books");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        apiUrl + "/logout", {},
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );
    } catch {}
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="w-full px-6 py-8">

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">
                {books.length} {books.length === 1 ? "book" : "books"} current reading
            </h3>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Book table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Cover</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide w-64">Progress</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50 transition">

                    {/* Cover */}
                    <td className="px-4 py-3">
                      {book.cover_image ? (
                        <img
                          src={mediaUrl + `/${book.cover_image}`}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-blue-50 rounded-md flex items-center justify-center">
                          <span className="text-xl">📘</span>
                        </div>
                      )}
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{book.title}</p>
                      {book.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                          {book.description}
                        </p>
                      )}
                    </td>

                    {/* Author */}
                    <td className="px-4 py-3 text-gray-600">
                      {book.author}
                    </td>

                    {/* Progress bar */}
                    <td className="px-4 py-3 w-64">
                      {book.total_pages ? (
                        <div>
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{book.current_pages || 0} / {book.total_pages} pages</span>
                            <span>
                              {Math.min(
                                100,
                                Math.round(((book.current_pages || 0) / book.total_pages) * 100)
                              )}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((book.current_pages || 0) / book.total_pages) * 100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No data</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">

                        {book.book_url && (
                          <button
                            onClick={() => {
                              setSelectedBook(book);
                              setSelectedProgressId(book.progress_id);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-lg transition font-medium whitespace-nowrap"
                          >
                            Read PDF
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>

      {/* PDF Viewer — rendered OUTSIDE the table, once at page level */}
      {selectedBook && (
        <PDFViewer
          bookUrl={baseUrl + `/${selectedBook.book_url}`}
          bookId={selectedBook.id}
          userId={user?.id}
          progressId={selectedProgressId}
          initialPage={selectedBook.current_pages || 1}
          onClose={() => {
            setSelectedBook(null);
            setSelectedProgressId(null);
          }}
        />
      )}

    </div>
  );
};

export default Progress;