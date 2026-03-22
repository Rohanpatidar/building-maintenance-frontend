import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const ManageExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ description: "", amount: "", category: "REPAIR" });
    const [message, setMessage] = useState("");

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const res = await api.get("/finance/expenses");
            setExpenses(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post("/finance/expenses", formData);
            setMessage("✅ Expense recorded!");
            setFormData({ description: "", amount: "", category: "REPAIR" });
            fetchData();
        } catch (err) { setMessage("❌ Error recording expense"); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this record?")) return;
        await api.delete(`/finance/expenses/${id}`);
        fetchData();
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">💸 Society Expenses</h1>

            <div className="bg-white p-6 rounded-xl shadow-md mb-8 border-l-4 border-red-500">
                <h2 className="text-lg font-bold mb-4">Add New Expense</h2>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="text-sm font-bold">Description</label>
                        <input type="text" className="w-full border p-2 rounded" required
                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-sm font-bold">Category</label>
                        <select className="w-full border p-2 rounded"
                            value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                            <option value="REPAIR">Repair</option>
                            <option value="UTILITY">Utility (Water/Elect)</option>
                            <option value="SALARY">Salary</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-bold">Amount (₹)</label>
                        <input type="number" className="w-full border p-2 rounded" required
                            value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                    </div>
                    <button className="bg-red-600 text-white p-2 rounded font-bold hover:bg-red-700">Add Expense</button>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(exp => (
                            <tr key={exp.id} className="border-b">
                                <td className="p-4">{exp.expenseDate}</td>
                                <td className="p-4 font-semibold">{exp.description}</td>
                                <td className="p-4"><span className="text-xs bg-gray-200 px-2 py-1 rounded">{exp.category}</span></td>
                                <td className="p-4 text-red-600 font-bold">₹{exp.amount}</td>
                                <td className="p-4 text-center">
                                    <button onClick={() => handleDelete(exp.id)} className="text-red-500 hover:scale-110">🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageExpenses;