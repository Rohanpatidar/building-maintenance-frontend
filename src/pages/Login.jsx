import { useState, useEffect } from "react";

import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // --- YE NARE CHANGES HAI ---
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (token) {
            // Agar pehle se token hai, toh seedha dashboard bhej do
            if (role === "ROLE_ADMIN" || role === "ADMIN") {
                navigate("/admin-dashboard", { replace: true });
            } else {
                navigate("/user-dashboard", { replace: true });
            }
        }
    }, [navigate]);
    // ---------------------------

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await api.post("/users/login", { username, password });
            const token = response.data.token;

            localStorage.setItem("token", token);
            localStorage.setItem("userId", response.data.id);
            localStorage.setItem("role", response.data.role);

            const decoded = jwtDecode(token);

            // Redirect karte waqt { replace: true } zaroor lagayein
            // Isse login page history stack se hat jata hai
            if (decoded.role === "ROLE_ADMIN" || decoded.role === "ADMIN") {
                navigate("/admin-dashboard", { replace: true });
            } else {
                navigate("/user-dashboard", { replace: true });
            }

        } catch (err) {
            console.error("Login Failed:", err);
            setError("Invalid Username or Password!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Society Login</h2>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="text-right mt-2">
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="text-sm font-bold text-indigo-600 hover:underline"
                        >
                            Forgot Password or Username?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                    >
                        Login Securely
                    </button>
                </form>

                {/* 👇 ADDED THIS SECTION: Link to Register Page */}
                <div className="mt-6 text-center border-t pt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button
                            onClick={() => navigate("/register")}
                            className="text-blue-600 font-bold hover:underline focus:outline-none"
                        >
                            Register here
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;