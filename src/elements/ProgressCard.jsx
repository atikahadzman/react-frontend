import { Link } from "react-router-dom";

export default function ProgressCard({ book, user, onRead }) {
    const hasProgress = !!book.progress_id && user?.id === book.user_id;

    const percent = Math.min(
        100,
        Math.round((book.bookmark / book.total_pages) * 100)
    );

    return (
        <div className="rounded-xl bg-[#f9f3ee] border border-gray-100 p-5 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6">
                {/* book cover */}
                <Link
                    to={`/books/${book.id}`}
                    className="flex justify-center md:block shrink-0"
                >
                    <img
                        src={book.cover_image_url || "/not-exist.jpg"}
                        alt={book.title}
                        loading="lazy"
                        className="w-44 md:w-32 rounded-2xl object-cover hover:scale-105 transition"
                    />
                </Link>

                {/* book info */}
                <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-semibold text-indigo-900">
                                {book.title}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                by {book.author}
                            </p>
                        </div>

                        <span className="w-fit rounded-md bg-rose-400 text-rose-900 px-2 py-1 text-xs font-semibold">
                            {hasProgress ? "In Progress" : "Not Started"}
                        </span>
                    </div>

                    {/* progress */}
                    <div className="mt-5">
                        <div className="flex justify-between text-sm text-gray-700 mb-2">
                            <span>
                                {book.bookmark} / {book.total_pages} pages
                            </span>
                            <span>{percent}%</span>
                        </div>

                        <div className="h-5 rounded-full bg-gray-200 overflow-hidden">
                            <div
                                className="bg-lime-400 h-full transition-all"
                                style={{
                                    width: `${percent}%`,
                                }}
                            />
                        </div>

                    </div>

                    <p className="mt-3 text-xs text-gray-500">
                        Last read at {book.last_read_at}
                    </p>

                    <div className="mt-5">
                        <button
                            onClick={onRead}
                            className="border-2 border-indigo-900 text-indigo-900 px-5 py-2 hover:bg-indigo-900 hover:text-white transition"
                        >
                            Continue...
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}