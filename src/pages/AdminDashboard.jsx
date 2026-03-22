import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { jwtDecode } from "jwt-decode";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("Admin");

    const [stats, setStats] = useState({
        totalResidents: 0,
        totalFlats: 0,
        pendingBills: 0,
        societyBalance: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) { navigate("/login"); return; }

                const decoded = jwtDecode(token);
                setUsername(decoded.sub);

                const response = await api.get("/admin/stats");
                setStats(response.data);

            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) return <div className="p-10 text-center font-bold text-gray-600">Loading Admin Panel...</div>;

    const cards = [
        { title: "Total Residents", value: stats.totalResidents, color: "bg-blue-600", icon: "👥" },
        { title: "Total Flats", value: stats.totalFlats, color: "bg-green-600", icon: "🏢" },
        { title: "Pending Bills", value: stats.pendingBills, color: "bg-red-500", icon: "⚠️" },
        { title: "Society Balance", value: `₹ ${stats.societyBalance}`, color: "bg-purple-600", icon: "💰" },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 text-white flex flex-col hidden md:flex">
                <div className="p-6 text-2xl font-bold border-b border-slate-700 flex items-center gap-2">
                    🛡️ Admin Panel
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button className="w-full text-left py-3 px-4 bg-slate-700 rounded-lg shadow-inner font-semibold">Dashboard</button>

                    {/* 🚀 NEW: User Management Sidebar Button */}
                    <button
                        onClick={() => navigate("/admin/users")}
                        className="w-full text-left py-3 px-4 hover:bg-slate-700 rounded-lg transition text-slate-300 flex items-center gap-2"
                    >
                        👥 Manage Admins
                    </button>

                    <button
                        onClick={() => navigate("/manage-flats")}
                        className="w-full text-left py-3 px-4 hover:bg-slate-700 rounded-lg transition text-slate-300"
                    >
                        Manage Flats
                    </button>

                    <button
                        onClick={() => navigate("/manage-bills")}
                        className="w-full text-left py-3 px-4 hover:bg-slate-700 rounded-lg transition text-slate-300"
                    >
                        Billing & Payments
                    </button>
                    <button className="w-full text-left py-3 px-4 hover:bg-slate-700 rounded-lg transition text-slate-300">Complaints</button>
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <button onClick={handleLogout} className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded font-bold transition">
                        Logout
                    </button>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700 p-4">
                    <button
                        onClick={() => navigate("/user-dashboard")}
                        className="w-full text-left py-3 px-4 bg-blue-900 hover:bg-blue-800 rounded-lg transition text-blue-100 font-bold flex items-center gap-2"
                    >
                        🏠 Resident View
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
                        <p className="text-gray-500 mt-1">Welcome back, {username}</p>
                    </div>
                    <button onClick={handleLogout} className="md:hidden bg-red-600 text-white px-4 py-2 rounded">Logout</button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {cards.map((card, index) => (
                        <div key={index} className={`${card.color} text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium opacity-80 uppercase tracking-wide">{card.title}</p>
                                    <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
                                </div>
                                <span className="text-3xl opacity-50">{card.icon}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow p-8 text-center border border-gray-200 mb-8">
                    <h2 className="text-gray-400 text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button onClick={() => navigate("/directory")} className="bg-green-100 text-green-700 px-6 py-3 rounded-lg font-bold hover:bg-green-200 transition">
                            👥 Resident Directory
                        </button>

                        {/* 🚀 NEW: User Management Quick Action */}
                        <button onClick={() => navigate("/admin/users")} className="bg-indigo-100 text-indigo-700 px-6 py-3 rounded-lg font-bold hover:bg-indigo-200 transition">
                            👑 Promote to Admin
                        </button>

                        <button onClick={() => navigate("/manage-flats")} className="bg-blue-100 text-blue-700 px-6 py-3 rounded-lg font-bold hover:bg-blue-200 transition">
                            + Add New Flat
                        </button>
                        <button onClick={() => navigate("/manage-bills")} className="bg-green-100 text-green-700 px-6 py-3 rounded-lg font-bold hover:bg-green-200 transition">
                            + Generate Bills
                        </button>
                    </div>
                </div>

                {/* --- FINANCIAL MANAGEMENT SECTION --- */}
                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">💰 Financial Controls</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div onClick={() => navigate("/manage-expenses")} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500 cursor-pointer hover:shadow-lg transition">
                            <div className="text-3xl mb-2">💸</div>
                            <h3 className="font-bold text-gray-800">Manage Expenses</h3>
                            <p className="text-sm text-gray-500">Record society spending (Repairs, Salaries, etc.)</p>
                        </div>

                        <div onClick={() => navigate("/manage-bills")} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition">
                            <div className="text-3xl mb-2">🧾</div>
                            <h3 className="font-bold text-gray-800">Billing System</h3>
                            <p className="text-sm text-gray-500">Generate monthly maintenance for flats</p>
                        </div>

                        <div onClick={() => navigate("/balance-sheet")} className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl shadow-md text-white cursor-pointer hover:scale-105 transition">
                            <div className="text-3xl mb-2">📊</div>
                            <h3 className="font-bold">Master Balance Sheet</h3>
                            <p className="text-sm text-blue-100">View real-time Income vs Expense report</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;