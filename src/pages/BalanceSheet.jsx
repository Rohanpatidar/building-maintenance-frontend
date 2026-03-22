import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const BalanceSheet = () => {
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryRes, expenseRes] = await Promise.all([
                    api.get("/finance/balance-sheet"),
                    api.get("/finance/expenses")
                ]);
                setSummary(summaryRes.data);
                setExpenses(expenseRes.data);
            } catch (err) {
                console.error("Error loading financial data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-10 text-center">Calculating Balance...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">📊 Society Balance Sheet</h1>

            {/* --- SUMMARY CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-6xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
                    <h3 className="text-gray-500 font-bold text-sm uppercase">Total Collections (Income)</h3>
                    <p className="text-3xl font-bold text-green-600">₹{summary.totalIncome.toLocaleString()}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-500">
                    <h3 className="text-gray-500 font-bold text-sm uppercase">Total Spending (Expenses)</h3>
                    <p className="text-3xl font-bold text-red-600">₹{summary.totalExpenses.toLocaleString()}</p>
                </div>

                <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white">
                    <h3 className="text-blue-100 font-bold text-sm uppercase">Current Available Balance</h3>
                    <p className="text-4xl font-bold">₹{summary.balance.toLocaleString()}</p>
                </div>
            </div>

            {/* --- EXPENSE LOG --- */}
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 bg-gray-800 text-white font-bold flex justify-between">
                    <span>📉 Society Spending Log</span>
                    <span className="text-sm opacity-70">Transaprency Record</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="p-4 text-gray-600">Date</th>
                                <th className="p-4 text-gray-600">Description</th>
                                <th className="p-4 text-gray-600">Category</th>
                                <th className="p-4 text-gray-600 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.length === 0 ? (
                                <tr><td colSpan="4" className="p-10 text-center text-gray-400">No expenses recorded yet.</td></tr>
                            ) : (
                                expenses.map(exp => (
                                    <tr key={exp.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-4 text-gray-600">{exp.expenseDate}</td>
                                        <td className="p-4 font-semibold text-gray-800">{exp.description}</td>
                                        <td className="p-4">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">
                                                {exp.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right text-red-600 font-bold">- ₹{exp.amount.toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BalanceSheet;