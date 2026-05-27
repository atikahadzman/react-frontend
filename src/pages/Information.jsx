import { useState, useEffect } from "react";

export default function Information() {
    return (
        <div className="justify-center items-center bg-blue-200 pt-6 mt-6">
            <h3 className="font-poppins text-2xl font-bold text-black">
                Get to know
            </h3>

            <div className="justify-center items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div key="" className="flex flex-row gap-4 items-center p-3">
                        <img
                            src="/avatar-1.jpg"
                            alt="Writer One"
                            className="h-24 w-16 object-cover rounded-4xl flex-shrink-0"
                        />

                        <div className="flex flex-col gap-1">
                            <div className="font-poppins font-semibold text-black">
                                Wtiter One
                            </div>
                            <div className="font-poppins text-sm text-gray-700">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                                when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                            </div>
                        </div>
                    </div>

                    <div key="" className="flex flex-row gap-4 items-center p-3">
                        <img
                            src="/avatar-3.jpg"
                            alt="Writer Two"
                            className="h-24 w-16 object-cover rounded-4xl flex-shrink-0"
                        />

                        <div className="flex flex-col gap-1">
                            <div className="font-poppins font-semibold text-black">
                                Wtiter Two
                            </div>
                            <div className="font-poppins text-sm text-gray-700">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                                when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    );
}