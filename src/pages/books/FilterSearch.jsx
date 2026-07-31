import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function FilterSearch({ books, onFilter }) {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const getBookStatus = (book) => {
        if (book.bookmark == null) return "not_started";
        if (Number(book.bookmark) >= Number(book.total_pages)) return "completed";
        return "in_progress";
    };

    const statusLabels = {
        not_started: "Not Started",
        in_progress: "In Progress",
        completed: "Completed",
    };

     const handleFilter = (newSearch, newStatus) => {
        const filtered = books.filter((book) => {
            const matchSearch =
                book.title
                    ?.toLowerCase()
                    .includes(newSearch.toLowerCase()) ||
                book.author
                    ?.toLowerCase()
                    .includes(newSearch.toLowerCase());

            const matchStatus = newStatus
                ? getBookStatus(book) === newStatus
                : true;

            return matchSearch && matchStatus;
        });

        onFilter(filtered);
    };

    const handleSearch = (value) => {
        setSearch(value);
        handleFilter(value, filterStatus);
    };

    const handleStatus = (value) => {
        setFilterStatus(value);
        handleFilter(search, value);
    };
    
    return (
        <div className="flex gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="text-white w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />

                <select
                    value={filterStatus}
                    onChange={(e) => handleStatus(e.target.value)}
                    className="bg-[#1e1e2c] text-white px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All status</option>
                        {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                </select>
            </div>
    );
};
