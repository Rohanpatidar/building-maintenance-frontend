import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const ManageBills = () => {
    const navigate = useNavigate();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAutoEnabled, setIsAutoEnabled] = useState(false); // ✅ State for Auto-Billing

    const currentYear = new Date().getFullYear();
    const months = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];

    const [formData, setFormData] = useState({
        month: "",
        amount: "2500",
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchData();
        fetchSettings(); // ✅ Load the switch state on startup
    }, []);

    const fetchData = async () => {
        try {
            const billRes = await api.get("/finance/bills");
            setBills(billRes.data);
        } catch (error) {
            console.error("Error loading data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await api.get("/finance/settings");
            setIsAutoEnabled(res.data.autoBillingEnabled);
        } catch (error) {
            console.error("Error loading settings", error);
        }
    };

    // ✅ Handle the Smart Toggle Switch
    const handleToggleAutoBilling = async () => {
        try {
            const newValue = !isAutoEnabled;
            await api.put("/finance/settings/toggle-auto-billing", { enabled: newValue });
            setIsAutoEnabled(newValue);
            setMessage(newValue ? "✅ Auto-Billing Enabled for 1st of every month" : "⚠️ Auto-Billing Disabled");
        } catch (err) {
            setMessage("❌ Failed to update auto-billing settings");
        }
    };

    const handleGenerate = async (targetStatus) => {
        setMessage("");
        if (!formData.month) {
            setMessage("❌ Please select a month from the dropdown!");
            return;
        }

        try {
            const response = await api.post(`/finance/bills/generate?status=${targetStatus}`, {
                month: formData.month,
                amount: parseFloat(formData.amount)
            });

            setMessage(`✅ ${response.data}`);
            fetchData();
        } catch (error) {
            setMessage("❌ Error: " + (error.response?.data || "Failed"));
        }
    };

    const handleDelete = async (bill) => {
        if (bill.status === "PAID") {
            alert("🛑 Action Denied: Cannot delete a bill that has already been paid!");
            return;
        }

        if (!window.confirm(`Are you sure you want to delete the bill for Flat ${bill.flat?.flatNumber}?`)) {
            return;
        }

        try {
            await api.delete(`/finance/bills/${bill.id}`);
            setMessage("✅ Bill deleted successfully!");
            fetchData();
        } catch (error) {
            console.error("Delete Error:", error);
            setMessage("❌ Failed to delete the bill.");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Billing System...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
            <div className="w-full max-w-6xl flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Billing & Payments</h1>
                <button onClick={() => navigate("/admin-dashboard")} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition">
                    ← Back to Dashboard
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-6xl mb-8 border-l-4 border-blue-600">

                {/* ✅ FEATURE 2: AUTO-BILLING TOGGLE UI */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-8 border border-blue-100">
                    <div className="flex items-center gap-4">
                        <div
                            onClick={handleToggleAutoBilling}
                            className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${isAutoEnabled ? 'bg-green-500' : 'bg-gray-400'}`}
                        >
                            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${isAutoEnabled ? 'translate-x-7' : ''}`} />
                        </div>
                        <div>
                            <span className="font-bold text-gray-700 block">Automated Monthly Billing</span>
                            <p className="text-xs text-gray-500 italic">Generate bills for all occupied flats automatically on the 1st of every month.</p>
                        </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${isAutoEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                        {isAutoEnabled ? "AUTO-ON" : "AUTO-OFF"}
                    </span>
                </div>

                <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2"> manual Generation</h2>

                {message && (
                    <div className={`p-3 mb-6 rounded font-semibold text-center ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {message}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-600 mb-1">Billing Month</label>
                            <select
                                className="w-full border p-2 rounded focus:outline-blue-500 bg-white"
                                value={formData.month}
                                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                            >
                                <option value="">-- Choose Month --</option>
                                {months.map(m => (
                                    <option key={m} value={`${m}-${currentYear}`}>
                                        {m} {currentYear}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-48">
                            <label className="block text-sm font-bold text-gray-600 mb-1">Amount (₹)</label>
                            <input
                                type="number"
                                className="w-full border p-2 rounded"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button onClick={() => handleGenerate("SELF_OCCUPIED")} className="bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 shadow-md transition">
                            🏠 Occupied Flats
                        </button>
                        <button onClick={() => handleGenerate("RENTED")} className="bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 shadow-md transition">
                            🔑 Rented Flats
                        </button>
                        <button onClick={() => handleGenerate("VACANT")} className="bg-gray-600 text-white font-bold py-3 rounded hover:bg-gray-700 shadow-md transition">
                            🔲 Vacant Flats
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-6xl">
                <h2 className="text-xl font-bold text-gray-700 mb-4">📜 Global Payment History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-gray-600 uppercase text-sm">
                                <th className="p-3 border-b">Bill ID</th>
                                <th className="p-3 border-b">Flat</th>
                                <th className="p-3 border-b">Resident</th>
                                <th className="p-3 border-b">Month</th>
                                <th className="p-3 border-b">Amount</th>
                                <th className="p-3 border-b">Status</th>
                                <th className="p-3 border-b text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill) => (
                                <tr key={bill.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3 text-gray-500">#{bill.id}</td>
                                    <td className="p-3 font-bold text-gray-800">{bill.flat?.flatNumber}</td>
                                    <td className="p-3 text-gray-600">{bill.user?.fullName}</td>
                                    <td className="p-3 text-gray-600">{bill.month}</td>
                                    <td className="p-3 font-bold">₹ {bill.amount}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${bill.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {bill.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => handleDelete(bill)}
                                            className="text-red-500 hover:text-red-700 transition p-1"
                                            title="Delete Bill"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
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

export default ManageBills;