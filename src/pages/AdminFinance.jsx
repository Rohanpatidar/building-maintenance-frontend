import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

const AdminFinance = () => {
    // State for Bill Generation
    const [billData, setBillData] = useState({ amount: "", month: "" });

    // State for Adding Expense
    const [expenseData, setExpenseData] = useState({ description: "", amount: "" });

    // State for Financial Summary
    const [report, setReport] = useState({ totalIncome: 0, totalExpense: 0, currentBalance: 0 });
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            const res = await api.get("/finance/report");
            setReport(res.data);
        } catch (err) {
            console.error("Error fetching report");
        }
    };

    // --- 1. GENERATE BILLS ---
    const handleGenerateBills = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/finance/bills/generate", billData);
            setMessage(`✅ ${res.data}`);
            setBillData({ amount: "", month: "" }); // Reset
        } catch (error) {
            setMessage("❌ Failed to generate bills.");
        }
    };

    // --- 2. ADD EXPENSE ---
    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            await api.post("/finance/expenses", expenseData);
            setMessage("✅ Expense Added Successfully!");
            setExpenseData({ description: "", amount: "" }); // Reset
            fetchReport(); // Update Balance immediately
        } catch (error) {
            setMessage("❌ Failed to add expense.");
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">💰 Finance Management</h1>

            {/* --- LIVE BALANCE CARD --- */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border-l-8 border-blue-600 grid grid-cols-3 gap-4 text-center">
                <div>
                    <h3 className="text-gray-500 font-bold">Total Collected</h3>
                    <p className="text-2xl font-bold text-green-600">₹{report.totalIncome}</p>
                </div>
                <div>
                    <h3 className="text-gray-500 font-bold">Total Expenses</h3>
                    <p className="text-2xl font-bold text-red-600">₹{report.totalExpense}</p>
                </div>
                <div>
                    <h3 className="text-gray-500 font-bold">Current Balance</h3>
                    <p className="text-3xl font-bold text-blue-700">₹{report.currentBalance}</p>
                </div>
            </div>

            {message && <div className="bg-yellow-100 p-3 mb-4 rounded text-center font-bold">{message}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* --- A. GENERATE BILLS FORM --- */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-blue-700 mb-4 border-b pb-2">📄 Generate Monthly Maintenance</h2>
                    <form onSubmit={handleGenerateBills} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600">Month</label>
                            <input
                                type="text"
                                placeholder="e.g. MARCH-2026"
                                className="w-full p-2 border rounded bg-gray-50"
                                required
                                value={billData.month}
                                onChange={(e) => setBillData({ ...billData, month: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600">Amount Per Flat (₹)</label>
                            <input
                                type="number"
                                placeholder="e.g. 2000"
                                className="w-full p-2 border rounded bg-gray-50"
                                required
                                value={billData.amount}
                                onChange={(e) => setBillData({ ...billData, amount: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
                            🚀 Generate Bills for All Users
                        </button>
                    </form>
                </div>

                {/* --- B. ADD EXPENSE FORM --- */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-500">
                    <h2 className="text-xl font-bold text-red-700 mb-4 border-b pb-2">💸 Record Society Expense</h2>
                    <form onSubmit={handleAddExpense} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600">Description</label>
                            <input
                                type="text"
                                placeholder="e.g. Lift Repair, Gardener Salary"
                                className="w-full p-2 border rounded bg-gray-50"
                                required
                                value={expenseData.description}
                                onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600">Amount (₹)</label>
                            <input
                                type="number"
                                placeholder="e.g. 500"
                                className="w-full p-2 border rounded bg-gray-50"
                                required
                                value={expenseData.amount}
                                onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700">
                            ➖ Add Expense
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminFinance;