import { useState, useEffect } from "react";

export default function Banner() {
    return (
        <div className="relative">
            {/* mobile */}
            <img src="/banner-mobile.png" className="block md:hidden w-full object-cover rounded-2xl" />

            {/* desktop */}
            <img src="/banner.png" className="hidden md:block w-full h-64 object-cover rounded-2xl" />

            <div className="absolute inset-0 flex flex-col justify-center items-center text-indigo-900">
                <h4 className="font-poppins text-2xl md:text-4xl font-bold">
                    Your next great read is waiting.
                </h4>
                <p className="font-poppins font-bold text-sm text-gray-800 italic">
                    Every page turns a stranger into a friend.
                </p>

                <a href="/books"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition mt-4"
                >
                    Start now
                </a>
            </div>
        </div>
    );
}