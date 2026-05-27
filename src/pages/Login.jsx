import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import { useAuth } from "../context/AuthContext";
import '../index.css'

const Login = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axios.post(apiUrl + "/login", {
                email,
                password,
            });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* form */}
            <div className="w-full md:w-2/5 bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <h2 className="text-gray-800">
                            Sign in to your account
                        </h2>
                    </div>

                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* email */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                            </div>

                                <input
                                    type="email"
                                    placeholder="you@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                        </div>

                        {/* password */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>

                                <a href="#" className="text-xs text-blue-600 hover:underline">
                                    Forgot password?
                                </a>
                            </div>

                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-200"/>
                        <span className="px-3 text-xs text-gray-400">or</span>
                        <div className="flex-1 border-t border-gray-200"/>
                    </div>

                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </div>

            {/* image */}
            <div className="hidden md:flex md:w-3/5 items-center justify-center p-12">
                <img
                    src="/reading.png"
                    alt="Reading illustration"
                    className="max-w-full h-auto"
                />
            </div>
        </div>
    );
};

export default Login;