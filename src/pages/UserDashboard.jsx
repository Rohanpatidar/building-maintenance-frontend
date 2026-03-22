import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axiosConfig";
import NoticeBoard from "../pages/NoticeBoardPage";
import ComplaintBox from "../pages/ComplaintsPage";

const UserDashboard = () => {
    const navigate = useNavigate();

    // User State
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");

    // Data State
    const [myFlat, setMyFlat] = useState(null);
    const [bills, setBills] = useState([]);

    // UI State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");

                if (!token || !userId) {
                    navigate("/login");
                    return;
                }

                const decoded = jwtDecode(token);
                setUsername(decoded.sub);
                setRole(decoded.role || decoded.authorities);

                try {
                    const flatRes = await api.get("api/flats/my-flat");
                    setMyFlat(flatRes.data);
                } catch (flatErr) {
                    console.warn("Flat not assigned yet");
                }

                const billRes = await api.get(`api/finance/bills/user/${userId}`);
                setBills(billRes.data);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handlePayBill = async (billId) => {
        if (!window.confirm("Confirm payment for this bill?")) return;

        setPaying(true);
        try {
            await api.put(`api/finance/bills/${billId}/pay`);
            setBills(prevBills => prevBills.map(bill =>
                bill.id === billId
                    ? { ...bill, status: "PAID", paymentDate: new Date().toISOString() }
                    : bill
            ));
            alert("✅ Payment Successful!");
        } catch (error) {
            alert("❌ Payment Failed. Try again.");
        } finally {
            setPaying(false);
        }
    };

    // ✅ NEW: Handle PDF Receipt Download
    const handleDownload = async (billId) => {
        try {
            const response = await api.get(`api/finance/bills/${billId}/download`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Receipt_${billId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove(); // Cleanup
        } catch (error) {
            console.error("Download Error:", error);
            alert("❌ Could not download PDF. Please try again later.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
    };

    if (loading) return <div className="p-10 text-center text-blue-600 font-bold">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white shadow-lg">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold flex items-center gap-2">
                        🏢 <span>My Society</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:block opacity-90">Hello, {username}</span>
                        {(role === "ADMIN" || role === "ROLE_ADMIN") && (
                            <button
                                onClick={() => navigate("/admin-dashboard")}
                                className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded font-bold hover:bg-yellow-300 transition shadow-sm"
                            >
                                🛡️ Admin Panel
                            </button>

                        )}
                        <button
                            onClick={() => navigate("/edit-profile")}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-blue-600 font-semibold hover:bg-gray-50"
                        >
                            ⚙️ Edit Profile
                        </button>
                        <button onClick={handleLogout} className="bg-white text-blue-600 px-4 py-2 rounded font-bold hover:bg-gray-100 transition">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Resident Dashboard</h1>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* LEFT COLUMN */}
                    <div className="md:col-span-1 space-y-8">
                        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
                            <h2 className="text-xl font-bold text-gray-700 mb-4">🏠 My Flat Details</h2>
                            {myFlat ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Flat Number</span>
                                        <span className="font-bold text-gray-800">{myFlat.flatNumber || myFlat.flatNo}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Wing / Block</span>
                                        <span className="font-bold text-gray-800">{myFlat.wing}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Floor</span>
                                        <span className="font-bold text-gray-800">{myFlat.floor}</span>
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <span className="text-gray-500">Status</span>
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-bold">
                                            {myFlat.status || "Occupied"}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-400 italic">No flat assigned yet.</div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-700 mb-4">⚡ Quick Actions</h2>
                            <div className="flex flex-col gap-3">
                                <button onClick={() => navigate("/directory")} className="w-full bg-purple-50 text-purple-700 py-2 rounded-lg hover:bg-purple-100 font-semibold transition text-left px-4">
                                    👥 Resident Directory
                                </button>
                                <button
                                    onClick={() => navigate("/notices")}
                                    className="w-full bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 font-semibold transition text-left px-4"
                                >
                                    📢 View Notices
                                </button>
                                <button
                                    onClick={() => navigate("/complaints")}
                                    className="w-full bg-purple-50 text-purple-700 py-2 rounded-lg hover:bg-purple-100 font-semibold transition text-left px-4">
                                    🛠️ Raise Complaint
                                </button>
                                <button
                                    onClick={() => navigate("/payment-tracker")}
                                    className="w-full bg-white border-2 border-indigo-100 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-500 transition-all flex items-center gap-4 text-left group"
                                >
                                    <div className="bg-indigo-100 p-3 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        📊
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">Payment Tracker</h3>
                                        <p className="text-xs text-gray-500 uppercase tracking-tighter">View Public Transparency Records</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => navigate("/balance-sheet")}
                                    className="w-full bg-indigo-600 text-white py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-[1.02] flex flex-col items-center justify-center gap-1"
                                >
                                    <span className="text-2xl">📊</span>
                                    <span className="font-bold">Society Financial Transparency</span>
                                    <span className="text-xs text-indigo-100 opacity-80">View Income, Expenses & Current Balance</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-700 mb-6">💳 Maintenance Bills</h2>
                            {bills.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                    <p className="text-4xl mb-2">🎉</p>
                                    <h3 className="text-lg font-semibold text-gray-600">No Pending Bills</h3>
                                    <p className="text-sm text-gray-500">You are all caught up!</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-600 uppercase text-sm">
                                                <th className="p-4 rounded-tl-lg">Month</th>
                                                <th className="p-4">Amount</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4 rounded-tr-lg text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {bills.map((bill) => (
                                                <tr key={bill.id} className="hover:bg-gray-50 transition">
                                                    <td className="p-4 font-medium text-gray-800">
                                                        {bill.month}
                                                        {bill.paymentDate && (
                                                            <div className="text-xs text-green-600 font-normal mt-1">
                                                                Paid: {new Date(bill.paymentDate).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-gray-600 font-bold">₹ {bill.amount}</td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${bill.status === "PAID"
                                                            ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                            }`}>
                                                            {bill.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {bill.status === "PENDING" ? (
                                                            <button
                                                                onClick={() => handlePayBill(bill.id)}
                                                                disabled={paying}
                                                                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 shadow-sm transition disabled:bg-gray-400"
                                                            >
                                                                {paying ? "Paying..." : "Pay Now"}
                                                            </button>
                                                        ) : (
                                                            // ✅ UPDATED: Download Receipt Button
                                                            <button
                                                                onClick={() => handleDownload(bill.id)}
                                                                className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center justify-center gap-1 mx-auto"
                                                            >
                                                                📄 Download Receipt
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default UserDashboard;