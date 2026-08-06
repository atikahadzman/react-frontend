import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import { useAuth } from "../context/AuthContext";
import { loginUserAPI } from "../services/loginService";
import ErrorAlert from "../alert/ErrorAlert";
import '../index.css'

const Login = () => {
    const { loginGlobalState } = useAuth(); // Hook into global context state manager
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
            const loginData = await loginUserAPI(email, password);
            loginGlobalState(loginData);

            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex antialiased">
            <div className="w-full bg-[#13131a] md:w-2/5 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-gray-800">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-700 tracking-tight">
                            Sign in to your account
                        </h2>
                    </div>

                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-950/40 border border-red-800/60 rounded-xl">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Email
                            </label>
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="you@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border border-gray-700/60 rounded-xl text-sm text-gray-500 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 pr-12 transition-all"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Password
                                </label>
                                <a href="#" className="text-xs text-indigo-700 hover:text-indigo-500 font-medium hover:underline transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border border-gray-700/60 rounded-xl text-sm text-gray-500 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 pr-12 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3 px-4 border border-indigo-700 bg-indigo-900 hover:bg-indigo-500 text-white font-medium rounded-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-800"/>
                        <span className="px-3 text-xs text-gray-500 font-medium uppercase tracking-widest">or</span>
                        <div className="flex-1 border-t border-gray-800"/>
                    </div>

                    <p className="text-center text-sm text-gray-700">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-xs text-indigo-700 hover:text-indigo-500 font-medium hover:underline transition-colors"
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </div>

            <div className="hidden md:flex md:w-3/5 items-center justify-center p-12 bg-[#13131a]">
                <img
                    src="/login-bg.png"
                    alt="Reading illustration"
                    className="max-w-full xl:max-w-xl h-full object-contain"
                />
            </div>
        </div>
    );
}

export default Login;