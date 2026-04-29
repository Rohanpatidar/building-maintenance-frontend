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

    // ✅ Status Change Handle (Manual Dropdown)
    const handleStatusChange = async (flatId, newStatus) => {
        try {
            // Backend Controller expects @RequestParam String status
            await api.patch(`api/flats/${flatId}/status?status=${newStatus}`);
            setMessage(`✅ Status updated to ${newStatus}`);
            fetchData();
        } catch (error) {
            console.error("Update Error:", error);
            setMessage("❌ Failed to update status. Check if Backend is running.");
        }
    };

    // ✅ Assign Resident Logic
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

    // ✅ Add New Flat Logic
    const handleAddFlat = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("api/flats", newFlat);
            setMessage("✅ Flat Added Successfully!");
            setNewFlat({ flatNumber: "", wing: "", floor: "" });
            fetchData();
        } catch (error) {
            setMessage("❌ Error Adding Flat");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">🏢 Society Flat Management</h1>

            {message && (
                <div className={`p-3 mb-4 rounded text-center font-bold shadow-sm ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* --- ADD FLAT --- */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
                    <h2 className="text-xl font-bold text-blue-700 mb-4">➕ Add New Flat</h2>
                    <form onSubmit={handleAddFlat} className="space-y-3">
                        <input type="text" placeholder="Flat Number (e.g. 101)" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none" required
                            value={newFlat.flatNumber} onChange={(e) => setNewFlat({ ...newFlat, flatNumber: e.target.value })} />
                        <div className="flex gap-2">
                            <input type="text" placeholder="Wing (A/B)" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none" required
                                value={newFlat.wing} onChange={(e) => setNewFlat({ ...newFlat, wing: e.target.value })} />
                            <input type="text" placeholder="Floor" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none" required
                                value={newFlat.floor} onChange={(e) => setNewFlat({ ...newFlat, floor: e.target.value })} />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
                            {loading ? "Adding..." : "Create Flat"}
                        </button>
                    </form>
                </div>

                {/* --- ASSIGNMENT --- */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h2 className="text-xl font-bold text-green-700 mb-4">🔗 Assign Resident</h2>
                    <div className="space-y-3">
                        <select className="w-full p-2 border rounded bg-gray-50" value={selectedFlatId} onChange={(e) => setSelectedFlatId(e.target.value)}>
                            <option value="">-- Select Vacant Flat --</option>
                            {/* ✅ FIXED: Changed AVAILABLE to VACANT to match your Enum */}
                            {flats.filter(f => f.status === "VACANT").map(f => (
                                <option key={f.id} value={f.id}>Flat {f.flatNumber} (Wing {f.wing})</option>
                            ))}
                        </select>
                        <select className="w-full p-2 border rounded bg-gray-50" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                            <option value="">-- Select Resident Name --</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                        </select>
                        <button onClick={handleAssign} className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition shadow-md">
                            Confirm Assignment
                        </button>
                    </div>
                </div>
            </div>

            {/* --- FLAT INVENTORY TABLE --- */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-700 mb-4 font-serif">🏠 Society Flat Directory</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="p-4">Flat No.</th>
                                <th className="p-4">Resident/Owner</th>
                                <th className="p-4">Occupancy Status</th>
                                <th className="p-4">Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flats.map(flat => (
                                <tr key={flat.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-4 font-bold text-blue-600">Flat {flat.flatNumber}</td>
                                    <td className="p-4">
                                        {flat.ownerName || flat.owner?.fullName ? (
                                            <span className="font-medium text-gray-800">👤 {flat.ownerName || flat.owner.fullName}</span>
                                        ) : (
                                            <span className="text-gray-400 italic text-sm">Not Assigned</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {/* ✅ Status Dropdown with Correct Enums */}
                                        <select
                                            value={flat.status}
                                            onChange={(e) => handleStatusChange(flat.id, e.target.value)}
                                            className={`p-1.5 rounded font-bold text-xs border cursor-pointer outline-none ${flat.status === "SELF_OCCUPIED" ? "bg-green-100 text-green-700 border-green-300" :
                                                    flat.status === "VACANT" ? "bg-gray-100 text-gray-600 border-gray-300" :
                                                        "bg-blue-100 text-blue-700 border-blue-300"
                                                }`}
                                        >
                                            <option value="VACANT">VACANT</option>
                                            <option value="SELF_OCCUPIED">SELF_OCCUPIED</option>
                                            <option value="RENTED">RENTED</option>
                                        </select>
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
        </div>
    );
};

export default ManageFlats;