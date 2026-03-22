import { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        fullName: "",
        role: "ROLE_USER", // Default
        flatNumber: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            // Send data to backend
            await api.post("api/users/register", formData);
            setMessage("✅ Registration Successful! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            console.error("Registration Error:", error);
            const errorMsg = error.response?.data || "Registration Failed. Check inputs.";
            setMessage(`❌ ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
                <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Create Account</h2>

                {message && (
                    <div className={`p-3 mb-4 rounded text-center font-bold ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-blue-500 text-black"
                            required
                            placeholder="e.g. Rahul Sharma"
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-blue-500 text-black"
                            required
                            placeholder="e.g. rahul123"
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-blue-500 text-black"
                            required
                            placeholder="e.g. rahul@example.com"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {/* Role Selection
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                        <select
                            className="w-full p-3 border border-gray-300 rounded bg-white text-black focus:outline-blue-500"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="ROLE_USER">Resident</option>
                            <option value="ROLE_ADMIN">Admin</option>
                        </select>
                    </div> */}

                    {/* Flat Number (Conditional)
                    {formData.role === "ROLE_USER" && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Flat Number</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded bg-yellow-50 text-black focus:outline-blue-500"
                                placeholder="e.g. 101, A-304"
                                onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                            />
                        </div>
                    )} */}

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-blue-500 text-black"
                            required
                            placeholder="********"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white py-3 rounded font-bold transition shadow ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <div className="mt-6 text-center pt-4 border-t">
                    <Link to="/login" className="text-blue-600 hover:underline font-bold">
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;