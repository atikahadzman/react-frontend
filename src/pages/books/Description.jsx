import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Description = ({books}) => {
    const { user } = useAuth();

    return (
        <div className="text-white flex flex-col items-center md:flex-row md:justify-between md:gap-x-24">
            <div className="shrink-0">
                <img
                    src={books?.cover_image || "/not-exist.jpg"}
                    alt={books?.title}
                    className="h-80 w-64 hover:translate-y-1 rounded-xl"
                    loading="lazy"
                />
            </div>
            <div>
                <h1 className="font-poppins text-[#fce4ec] text-3xl font-bold">
                    {books?.title}
                </h1>

                <div className="flex justify-center items-center gap-2">
                    <h4 className="font-poppins text-3xl font-bold text-gray-400">
                        by {books?.author}
                    </h4>

                    <div
                        className={`w-fit rounded-md px-2 py-1 text-sm font-semibold whitespace-nowrap ${
                            books?.status == 1
                                ? "bg-lime-400 text-lime-900"
                                : "bg-rose-400 text-rose-900"
                        }`}
                    >
                        {books?.status == 1 ? "Enabled" : "Disabled"}
                    </div>
                </div>

                <p className="mt-6 text-xl pt-6">
                    {books?.description}
                </p>

                <div className="mt-6 text-lg pt-6">
                    Uploaded by <span className="font-bold">
                        {books?.user?.name}
                    </span> &nbsp;
                    <div className="inline-block h-3 border-l-2 border-red-600 mr-2"></div>
                    {books?.total_pages} pages
                </div>
            </div>
        </div>
    );
};

export default Description;