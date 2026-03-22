import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

const FinancialReport = () => {
    const [report, setReport] = useState({ totalIncome: 0, totalExpense: 0, currentBalance: 0 });
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const reportRes = await api.get("/finance/report");
            const expensesRes = await api.get("/finance/expenses");
            setReport(reportRes.data);
            setExpenses(expensesRes.data);
        } catch (error) {
            console.error("Error loading financial data");
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">📊 Society Balance Sheet</h1>

            {/* --- SUMMARY CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
                <div className="bg-white p-6 rounded-xl shadow border-t-4 border-green-500 text-center">
                    <h3 className="text-gray-500 font-bold uppercase text-sm">Total Income</h3>
                    <p className="text-3xl font-bold text-green-600">₹{report.totalIncome}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border-t-4 border-red-500 text-center">
                    <h3 className="text-gray-500 font-bold uppercase text-sm">Total Expenses</h3>
                    <p className="text-3xl font-bold text-red-600">₹{report.totalExpense}</p>
                </div>
                <div className="bg-blue-600 p-6 rounded-xl shadow text-center text-white">
                    <h3 className="font-bold uppercase text-sm opacity-80">Remaining Balance</h3>
                    <p className="text-4xl font-bold">₹{report.currentBalance}</p>
                </div>
            </div>

            {/* --- EXPENSE LOG --- */}
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gray-800 text-white p-4">
                    <h2 className="text-xl font-bold">📉 Expense History</h2>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-4 font-bold text-gray-600">Date</th>
                            <th className="p-4 font-bold text-gray-600">Description</th>
                            <th className="p-4 font-bold text-gray-600 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length === 0 ? (
                            <tr><td colSpan="3" className="p-4 text-center text-gray-500">No expenses recorded yet.</td></tr>
                        ) : (
                            expenses.map((exp) => (
                                <tr key={exp.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 text-gray-700">{exp.expenseDate}</td>
                                    <td className="p-4 font-semibold text-gray-800">{exp.description}</td>
                                    <td className="p-4 text-red-600 font-bold text-right">- ₹{exp.amount}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinancialReport;