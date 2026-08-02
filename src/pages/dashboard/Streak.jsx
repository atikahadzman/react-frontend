import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { getReadingStreak } from "../../services/progressService";
import { HiFire } from "react-icons/hi";

export default function Streak({ streak }) {
    console.log('streak: ' + JSON.stringify(streak))
    const [loading, setLoading] = useState(true);

    if (!streak?.message) {
        return (
            <div className="main-card bg-[#fec600] rounded-md font-poppins">
                <div className="card-body">
                    <h1 className="text-2xl font-bold text-[#152c3d]">
                        {streak?.streak}
                    </h1>
                </div>
            </div>
        );
    }

    const styles = {
        safe: {
            image: '/streak-1.png',
        },
        at_risk: {
            image: '/streak-4.png',
        },
        broken: {
            image: '/streak-3.png',
        },
        cold: {
            image: '/streak-2.png',
        }
    };

    const currentStyle = styles[streak?.status] || styles.cold;

    return (
        <div className="main-card bg-[#111111] rounded-md font-poppins">
            <div className="card-body">
                <h3 className="flex justify-center items-center font-bold text-white">
                    <HiFire className="text-orange-500 text-5xl" />
                    <span className="text-5xl px-2 py-2">{streak?.streak} </span>
                    <span className="text-lg font-bold text-white">Streak Days</span>
                </h3>

                <div className="flex flex-col items-center rounded-xl">
                    <div className="text-center">
                        {streak?.streak > 0 && (
                            <p className="font-bold text-lg text-white">
                                {streak?.streak} Streak Days
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <img
                            src={currentStyle.image}
                            alt="Reading streak"
                            className="w-40 md:w-40 h-40 rounded-2xl object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}