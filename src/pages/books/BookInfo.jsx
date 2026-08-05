import { Link } from "react-router-dom";
import Badges from "./Badges";

export default function BookInfo({ book, user }) {
    return (
        <>
            <Link
                to={`/books/${book.id}`}
                className="shrink-0"
            >
                <img
                    src={book.cover_image || "/not-exist.jpg"}
                    alt={book.title}
                    loading="lazy"
                    className="w-32 rounded-2xl object-cover hover:scale-105 transition"
                />
            </Link>

            <div className="flex-1">
                <Link to={`/books/${book.id}`}>
                    <h2 className="text-xl font-semibold text-indigo-900 hover:text-blue-600">
                        {book.title}
                    </h2>
                </Link>

                <div className="ml-3 flex flex-wrap gap-2 justify-center items-center">
                    <span className="text-sm text-gray-700">by {book.author}</span>
                    <Badges
                        book={book}
                        user={user}
                    />
                </div>

                <p className="mt-3 text-gray-700">
                    {book.description?.length > 100
                        ? book.description.slice(0, 100) + "..."
                        : book.description}
                </p>
            </div>
        </>
    );
}