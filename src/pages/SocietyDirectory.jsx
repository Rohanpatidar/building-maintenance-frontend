import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const SocietyDirectory = () => {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        api.get("api/flats/directory")
            .then(res => setMembers(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filteredMembers = members.filter(m =>
        m.flatNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center">Loading Directory...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">🏘️ Society Resident Directory</h1>

            {/* Search Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
                {/* Search Input Box */}
                <div className="w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search by name or flat number..."
                        className="w-full p-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-700 transition shadow-md whitespace-nowrap"
                >
                    ← Back
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-4">Flat</th>
                            <th className="p-4">Wing/Floor</th>
                            <th className="p-4">Resident Name</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map((m, idx) => (
                            <tr key={idx} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4 font-bold text-blue-700">{m.flatNumber}</td>
                                <td className="p-4 text-gray-600">{m.wing} - Floor {m.floor}</td>
                                <td className="p-4 font-semibold">{m.ownerName}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${m.status === 'OCCUPIED' ? 'bg-green-100 text-green-700' :
                                        m.status === 'TENANT_OCCUPIED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {m.status.replace('_', ' ')}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SocietyDirectory;