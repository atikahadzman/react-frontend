export default function Banner() {
    return (
        <div className="relative bg-[#fffbec] rounded-md font-poppins">
            {/* mobile */}
            <img src="/banner-mobile.png" className="block md:hidden w-full object-cover rounded-2xl" />

            {/* desktop */}
            <img src="/banner.png" className="hidden md:block w-full h-64 object-cover rounded-2xl" />

            <div className="absolute inset-0 flex flex-col justify-center items-center text-indigo-900">
                <h4 className="text-2xl md:text-4xl font-bold">
                    Your next great read is waiting.
                </h4>
                <p className="py-3 font-bold text-md text-gray-800 italic">
                    Every page turns a stranger into a friend.
                </p>

                <a href="/books"
                    className="border-2 border-indigo-900 text-indigo-900 px-5 py-2 hover:bg-indigo-900 hover:text-white transition"
                >
                    Start now
                </a>
            </div>
        </div>
    );
}