import { Link } from "react-router-dom";

export default function BookOfMonth() {
    return (
        <div className="main-card bg-[#0b8270] rounded-md py-5 font-poppins">
            <div className="card-body">
                <h3 className="text-2xl font-bold text-white">
                    Book of the Month
                </h3>

                {/* cover image */}
                <div className="flex justify-center items-center space-y-4 mt-5">
                    {/* <Link to={`/books/${book.id}`}> */}
                        <img
                            src="/It’s Okay Not to Get Along with Everyone.jpg"
                            className="w-50 object-cover rounded-2xl hover:translate-x-1 transition-transform"
                            alt="It’s Okay Not to Get Along with Everyone"
                            loading="lazy"
                        />
                    {/* </Link> */}
                </div>

                {/* title and status */}
                <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <div className="flex items-center gap-2">
                            <p className="text-xl font-semibold text-white hover:translate-x-1 transition-transform">
                                It’s Okay Not to Get Along with Everyone
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-white">by Dancing Snail</p>

                    <div className="flex justify-center items-center space-y-4 mt-5">
                        <button
                            className="border-2 border-white text-white px-6 py-3 hover:bg-white hover:text-blue-600 transition"
                        >
                            Start reading
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}