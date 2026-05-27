import { useState, useEffect } from "react";

export default function Banner() {
    return (
        <div className="relative">
            {/* mobile */}
            <img src="/banner-mobile.png" className="block md:hidden w-full h-48 object-cover rounded-2xl" />

            {/* desktop */}
            <img src="/banner.png" className="hidden md:block w-full h-64 object-cover rounded-2xl" />

            <div className="absolute inset-0 flex flex-col justify-center items-center text-indigo-900">
                <h1 className="font-poppins text-2xl md:text-4xl font-bold">Read anywhere, anytime</h1>
                <p className="font-poppins text-sm md:text-lg mt-2">Your subtitle or description</p>

                <a href="/books"
                    className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition font-medium whitespace-nowrap"
                >
                    Start now
                </a>
            </div>
        </div>
    );
}