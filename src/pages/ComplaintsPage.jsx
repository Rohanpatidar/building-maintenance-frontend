import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ComplaintsPage = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [newComplaint, setNewComplaint] = useState({ title: "", description: "" });
    const [replyText, setReplyText] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [totalRated, setTotalRated] = useState(0);
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setCurrentUser(decoded.sub);
            const role = decoded.role || decoded.authorities;
            if (role === "ADMIN" || role === "ROLE_ADMIN") setIsAdmin(true);
        }
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await api.get("api/complaints");
            if (Array.isArray(res.data)) {
                setComplaints(res.data);
                calculateStats(res.data);
            }
        } catch (error) { console.error("Error fetching complaints"); }
    };

    const calculateStats = (data) => {
        const rated = data.filter(c => c.status === "CLOSED" && c.rating > 0);
        if (rated.length > 0) {
            const sum = rated.reduce((acc, curr) => acc + curr.rating, 0);
            setAverageRating((sum / rated.length).toFixed(1));
        } else setAverageRating(0);
        setTotalRated(rated.length);
    };

    const handleRaise = async () => {
        if (!newComplaint.title || !newComplaint.description) return alert("Fill details");
        setLoading(true);
        try {
            await api.post("api/complaints", { title: newComplaint.title, description: newComplaint.description });
            setNewComplaint({ title: "", description: "" });
            fetchComplaints();
            alert("✅ Complaint Submitted!");
        } catch (error) { alert("❌ Failed"); }
        finally { setLoading(false); }
    };

    const handleResolve = async (id) => {
        if (!replyText) return;
        try {
            await api.put(`api/complaints/${id}/resolve`, { reply: replyText });
            setReplyText("");
            fetchComplaints();
        } catch (error) { alert("Failed to resolve"); }
    };

    const handleRate = async (id, stars) => {
        try {
            await api.put(`api/complaints/${id}/rate`, { rating: stars });
            fetchComplaints();
        } catch (error) { alert("Failed to rate"); }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Navbar Header */}
                <div className="flex justify-between items-center mb-8 bg-white p-5 rounded-2xl shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">⚠️ Complaints Helpdesk</h1>
                        <p className="text-gray-500 text-sm">Total Tickets: {complaints.length}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {totalRated > 0 && (
                            <div className="hidden md:flex bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-200 items-center gap-2">
                                <span className="text-xl font-bold text-yellow-600">{averageRating} ⭐</span>
                                <span className="text-xs text-yellow-700">({totalRated} Reviews)</span>
                            </div>
                        )}
                        <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">
                            Back
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Section - Raise Complaint */}
                    <div className="lg:col-span-1">

                        <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-red-500 sticky top-8">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">🚩 Raise New Issue</h2>
                            <div className="space-y-4">
                                <input className="w-full p-3 border rounded-xl" placeholder="Issue Subject"
                                    value={newComplaint.title} onChange={e => setNewComplaint({ ...newComplaint, title: e.target.value })} />
                                <textarea className="w-full p-3 border rounded-xl" placeholder="Details..." rows="5"
                                    value={newComplaint.description} onChange={e => setNewComplaint({ ...newComplaint, description: e.target.value })} />
                                <button onClick={handleRaise} disabled={loading} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700">
                                    {loading ? "Submitting..." : "Submit Complaint"}
                                </button>
                            </div>
                        </div>



                    </div>

                    {/* Complaint Feed */}
                    <div className="lg:col-span-2 space-y-4">
                        {complaints.map(c => (
                            <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-800">{c.title}</h4>
                                        <p className="text-xs text-gray-400">By {c.user?.username} • {new Date(c.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${c.status === "OPEN" ? "bg-red-100 text-red-600" :
                                        c.status === "RESOLVED" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                                        }`}>
                                        {c.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">{c.description}</p>

                                {isAdmin && c.status === "OPEN" && (
                                    <div className="mt-4 flex gap-2">
                                        <input className="flex-1 border p-2 rounded-lg" placeholder="Enter solution..."
                                            value={replyText} onChange={e => setReplyText(e.target.value)} />
                                        <button onClick={() => handleResolve(c.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700">Resolve</button>
                                    </div>
                                )}

                                {c.adminReply && (
                                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg my-3">
                                        <p className="text-xs font-bold text-green-800 uppercase mb-1">Admin Resolution:</p>
                                        <p className="text-sm text-green-900">{c.adminReply}</p>
                                    </div>
                                )}

                                {c.status === "RESOLVED" && c.user?.username === currentUser && (
                                    <div className="mt-4 text-center border-t pt-4">
                                        <p className="text-xs font-semibold text-gray-500 mb-2">Rate resolution to close ticket:</p>
                                        <div className="flex justify-center gap-3">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <button key={s} onClick={() => handleRate(c.id, s)} className="text-2xl hover:scale-125 transition">⭐</button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {c.status === "CLOSED" && (
                                    <div className="mt-4 flex justify-between items-center text-xs font-bold bg-gray-50 p-2 rounded-lg">
                                        <span className="text-gray-400 uppercase">Ticket History: CLOSED</span>
                                        <span className="text-yellow-600">Resolution Rating: {"⭐".repeat(c.rating)}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintsPage;