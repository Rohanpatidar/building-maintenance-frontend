import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const PaymentTrackerPage = () => {
    const navigate = useNavigate();
    const [bills, setBills] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // 🔍 Search State
    const [stats, setStats] = useState({ totalCollected: 0, pendingCount: 0, paidCount: 0 });

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            // Ensure the token is present (if your axiosConfig doesn't do it automatically)
            const token = localStorage.getItem("token");

            const res = await api.get("api/finance/bills", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = Array.isArray(res.data) ? res.data : [];
            setBills(data);

            // Stats logic...
            const paid = data.filter(b => b.status === "PAID");
            const total = paid.reduce((sum, b) => sum + b.amount, 0);
            setStats({
                totalCollected: total,
                paidCount: paid.length,
                pendingCount: data.filter(b => b.status === "PENDING").length
            });
        } catch (error) {
            console.error("Error loading tracker:", error.response?.data || error.message);
            // This will print the ACTUAL reason from the backend in your browser console
        }
    };

    // 🔍 Filter Logic
    const filteredBills = bills.filter(bill =>
        bill.flat?.flatNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">📊 Society Transparency Tracker</h1>
                    <button onClick={() => navigate(-1)} className="bg-gray-800 text-white px-8 py-3 rounded-2xl font-bold shadow-lg">← Back</button>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search flat number or resident name..."
                        className="w-full p-4 rounded-2xl border-none shadow-md focus:ring-4 focus:ring-indigo-200 outline-none text-lg"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Summary Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-xl">
                        <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Total Collected</p>
                        <h2 className="text-3xl font-black mt-1">₹ {stats.totalCollected.toLocaleString()}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-md border-b-8 border-green-500">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Paid Flats</p>
                        <h2 className="text-3xl font-black text-green-600 mt-1">{stats.paidCount} ✅</h2>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-md border-b-8 border-red-500">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Defaulters</p>
                        <h2 className="text-3xl font-black text-red-600 mt-1">{stats.pendingCount} 🚨</h2>
                    </div>
                </div>

                {/* Results Table */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900 text-white">
                            <tr>
                                <th className="p-5">Flat No.</th>
                                <th className="p-5">Resident</th>
                                <th className="p-5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBills.map((bill) => (
                                <tr key={bill.id} className="hover:bg-indigo-50/50 transition">
                                    <td className="p-5 font-black text-indigo-700">{bill.flat?.flatNumber}</td>
                                    <td className="p-5 text-gray-700 font-semibold">{bill.user?.fullName || "Not Assigned"}</td>
                                    <td className="p-5">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${bill.status === "PAID" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700 animate-pulse"
                                            }`}>
                                            {bill.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentTrackerPage;