import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const ManageFlats = () => {
    const [flats, setFlats] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedFlatId, setSelectedFlatId] = useState("");
    const [selectedUserId, setSelectedUserId] = useState("");
    const [newFlat, setNewFlat] = useState({ flatNumber: "", wing: "", floor: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [flatsRes, usersRes] = await Promise.all([
                api.get("api/flats"),
                api.get("api/users")
            ]);
            setFlats(flatsRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const handleAssign = async () => {
        if (!selectedFlatId || !selectedUserId) {
            alert("Please select both a Flat and a User!");
            return;
        }
        try {
            await api.put(`api/flats/${selectedFlatId}/assign/${selectedUserId}`);
            setMessage("✅ Flat Assigned Successfully!");
            setSelectedFlatId("");
            setSelectedUserId("");
            fetchData();
        } catch (error) {
            setMessage("❌ Assignment Failed");
        }
    };

    const handleAddFlat = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("api/flats", newFlat);
            setMessage("✅ Flat Added!");
            setNewFlat({ flatNumber: "", wing: "", floor: "" });
            fetchData();
        } catch (error) { setMessage("❌ Error Adding Flat"); }
        finally { setLoading(false); }
    };
    const handleExportExcel = async () => {
        try {
            const response = await api.get("api/flats/export/excel", {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Society_Directory.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert("❌ Failed to export Excel file.");
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">🏢 Society Flat Management</h1>

            {message && (
                <div className={`p-3 mb-4 rounded text-center font-bold ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* --- ADD FLAT --- */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
                    <h2 className="text-xl font-bold text-blue-700 mb-4">➕ Add New Flat</h2>
                    <form onSubmit={handleAddFlat} className="space-y-3">
                        <input type="text" placeholder="Flat Number" className="w-full p-2 border rounded" required
                            value={newFlat.flatNumber} onChange={(e) => setNewFlat({ ...newFlat, flatNumber: e.target.value })} />
                        <div className="flex gap-2">
                            <input type="text" placeholder="Wing" className="w-full p-2 border rounded" required
                                value={newFlat.wing} onChange={(e) => setNewFlat({ ...newFlat, wing: e.target.value })} />
                            <input type="text" placeholder="Floor" className="w-full p-2 border rounded" required
                                value={newFlat.floor} onChange={(e) => setNewFlat({ ...newFlat, floor: e.target.value })} />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
                            {loading ? "Adding..." : "Add Flat"}
                        </button>
                    </form>
                </div>

                {/* --- ASSIGNMENT --- */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h2 className="text-xl font-bold text-green-700 mb-4">🔗 Assign Resident</h2>
                    <div className="space-y-3">
                        <select className="w-full p-2 border rounded bg-gray-50" value={selectedFlatId} onChange={(e) => setSelectedFlatId(e.target.value)}>
                            <option value="">-- Choose Flat --</option>
                            {flats.map(f => (
                                <option key={f.id} value={f.id}>Flat {f.flatNumber} ({f.status})</option>
                            ))}
                        </select>
                        <select className="w-full p-2 border rounded bg-gray-50" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                            <option value="">-- Choose Resident --</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                        </select>
                        <button onClick={handleAssign} className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition">
                            Confirm Assignment
                        </button>
                    </div>
                </div>
            </div>

            {/* --- THE TABLE --- */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-700 mb-4">🏠 Flat Inventory</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="p-4">Flat Number</th>
                                <th className="p-4">Owner Name</th>
                                <th className="p-4">Occupancy Status</th>
                                <th className="p-4">Wing/Floor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flats.map(flat => (
                                <tr key={flat.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-4 font-bold text-blue-600">Flat {flat.flatNumber}</td>

                                    {/* ✅ FIXED: Looking for ownerName specifically */}
                                    <td className="p-4">
                                        {flat.ownerName ? (
                                            <span className="font-semibold text-gray-800 uppercase text-sm">👤 {flat.ownerName}</span>
                                        ) : flat.owner?.fullName ? (
                                            <span className="font-semibold text-gray-800 uppercase text-sm">👤 {flat.owner.fullName}</span>
                                        ) : (
                                            <span className="text-gray-400 italic">No Owner</span>
                                        )}
                                    </td>

                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${flat.status === "OCCUPIED" ? "bg-green-100 text-green-700" :
                                            flat.status === "TENANT_OCCUPIED" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                                            }`}>
                                            {flat.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm">
                                        {flat.wing} Wing | Floor {flat.floor}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">🏢 Flat Management</h1>
                <button
                    onClick={handleExportExcel}
                    className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 flex items-center gap-2 shadow-md"
                >
                    📊 Export to Excel
                </button>
            </div>
        </div>
    );
};

export default ManageFlats;