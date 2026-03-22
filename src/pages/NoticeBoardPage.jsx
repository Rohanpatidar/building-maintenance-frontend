import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const NoticeBoardPage = () => {
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [newNotice, setNewNotice] = useState({ title: "", content: "" });
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            const role = decoded.role || decoded.authorities;
            if (role === "ADMIN" || role === "ROLE_ADMIN") {
                setIsAdmin(true);
            }
        }
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await api.get("/notices");
            setNotices(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error loading notices");
            setNotices([]);
        }
    };

    const handlePostNotice = async () => {
        if (!newNotice.title || !newNotice.content) return alert("Please fill all fields");
        setLoading(true);
        try {
            await api.post("/notices", newNotice);
            setNewNotice({ title: "", content: "" });
            await fetchNotices();
        } catch (error) {
            alert("Failed to post notice.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/notices/${id}`);
            fetchNotices();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        📢 Society Notice Board
                    </h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                        ← Back
                    </button>
                </div>

                {/* Admin Post Form */}
                {isAdmin && (
                    <div className="mb-8 bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600">
                        <h3 className="font-bold text-gray-700 mb-4">✍️ Create Official Announcement</h3>
                        <div className="space-y-3">
                            <input
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Notice Title"
                                value={newNotice.title}
                                onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
                            />
                            <textarea
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Detailed content..."
                                rows="4"
                                value={newNotice.content}
                                onChange={e => setNewNotice({ ...newNotice, content: e.target.value })}
                            />
                            <button
                                onClick={handlePostNotice}
                                disabled={loading}
                                className={`w-full text-white py-3 rounded-lg font-bold transition ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                            >
                                {loading ? "Publishing..." : "Publish Notice"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Notices List */}
                <div className="grid gap-6">
                    {notices.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm italic text-gray-400">
                            No notices have been posted yet.
                        </div>
                    ) : (
                        notices.map((notice) => (
                            <div key={notice.id} className="relative bg-amber-50 border-l-8 border-amber-400 p-6 rounded-xl shadow-sm group">
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDelete(notice.id)}
                                        className="absolute top-4 right-4 text-red-400 hover:text-red-600 font-bold opacity-0 group-hover:opacity-100 transition"
                                    >
                                        Delete ✕
                                    </button>
                                )}
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{notice.title}</h4>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                                <div className="mt-4 pt-4 border-t border-amber-200 text-sm text-amber-700 font-semibold">
                                    📅 Posted on: {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString() : "Recently"}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoticeBoardPage;