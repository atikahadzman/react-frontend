import { Link } from "react-router-dom";

export default function BookOfMonth({ book }) {
    if (!book) {
        return (
            <div className="main-card bg-[#f9f3ee] rounded-md py-5 font-poppins">
                <div className="card-body">
                    <h3 className="text-2xl font-bold text-white">
                        Loading book of the month...
                    </h3>
                </div>
            </div>
        );
    }

    return (
        <div className="main-card bg-[#fec600] rounded-md py-5 font-poppins">
            <div className="card-body">
                <h3 className="text-2xl font-bold text-[#111111]">
                    Book of the Month
                </h3>

                {/* cover image */}
                <div className="flex justify-center items-center space-y-4 mt-5">
                    <Link to={`/book/${book.id}`}>
                        <img
                            src={book?.cover_image_url || "/not-exist.jpg"}
                            className="w-50 object-cover rounded-2xl hover:translate-x-1 transition-transform"
                            alt={book?.title}
                            loading="lazy"
                        />
                    </Link>
                </div>

                {/* title and status */}
                <div className="flex-1 w-full flex flex-col items-center text-center space-y-4 mt-5 text-[#111111]">
                    <p className="text-xl font-semibold hover:translate-x-1 transition-transform px-3">
                        {book?.title}
                    </p>

                    <p className="text-sm">
                        by {book?.author}
                    </p>

                    <div className="flex justify-center items-center space-y-4 mt-5">
                        <Link 
                            to={`/book/${book.id}`}
                            className="border-2 border-indigo-900 text-indigo-900 px-5 py-2 hover:bg-indigo-900 hover:text-white transition"
                        >
                            Start reading
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}