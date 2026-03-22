import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { jwtDecode } from "jwt-decode";

const UserBills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMyBills();
    }, []);

    const fetchMyBills = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const decoded = jwtDecode(token);
                // We assume token has userId, or we fetch user profile first. 
                // For now, let's assume we extract ID from somewhere, or decode username -> fetch ID.
                // Simpler: Backend endpoint "/api/users/me" is better, but let's assume you store userId in localstorage on login too?
                // OR: decode token "sub" (username) -> get user ID -> fetch bills.

                // Hack for now: Let's assume you pass userId manually or store it.
                // BETTER: Update your Login to localStorage.setItem("userId", response.data.id)
                const userId = localStorage.getItem("userId");

                if (userId) {
                    const res = await api.get(`api/finance/bills/user/${userId}`);
                    setBills(res.data);
                }
            }
        } catch (error) {
            console.error("Error fetching bills", error);
        }
    };

    const handlePayBill = async (billId) => {
        setLoading(true);
        try {
            await api.put(`api/finance/bills/${billId}/pay`);
            alert("✅ Payment Successful!");
            fetchMyBills(); // Refresh list
        } catch (error) {
            alert("Payment Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">🧾 My Maintenance Bills</h1>

            {bills.length === 0 ? (
                <p className="text-gray-500 text-lg">No bills found.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {bills.map((bill) => (
                        <div key={bill.id} className={`p-6 rounded-xl shadow-lg border-l-8 ${bill.status === "PAID" ? "bg-green-50 border-green-500" : "bg-white border-red-500"
                            }`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">{bill.month}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${bill.status === "PAID" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                                    }`}>
                                    {bill.status}
                                </span>
                            </div>

                            <p className="text-3xl font-bold text-gray-700 mb-2">₹{bill.amount}</p>

                            {bill.status === "PAID" ? (
                                <p className="text-sm text-green-600 font-semibold">
                                    Paid on: {bill.paymentDate}
                                </p>
                            ) : (
                                <button
                                    onClick={() => handlePayBill(bill.id)}
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 mt-2 shadow-md transition"
                                >
                                    💳 Pay Now
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserBills;