import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [formData, setFormData] = useState({
        fullName: "",
        email: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await api.get(`api/users/id/${userId}`);
                setFormData({
                    fullName: res.data.fullName,
                    email: res.data.email
                });
            } catch (err) {
                console.error("Error fetching profile data");
            }
        };
        fetchUserData();
    }, [userId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`api/users/${userId}`, formData);
            alert("Profile updated successfully! ✅");
            navigate(-1);
        } catch (err) {
            alert("Failed to update profile. Email might already be in use.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md border border-gray-100">
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-gray-800">Edit Profile</h2>
                    <p className="text-gray-500 text-sm">Update your basic information</p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
                        <input
                            required
                            className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email Address</label>
                        <input
                            required
                            type="email"
                            className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-indigo-200 shadow-lg hover:bg-indigo-700 transition-all disabled:bg-gray-400"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile; 