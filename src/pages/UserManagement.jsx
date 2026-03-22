import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users", err);
        }
    };

    const handlePromote = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to make ${userName} an Admin?`)) {
            try {
                await axios.put(`http://localhost:8080/api/users/${userId}/promote`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("User promoted successfully!");
                fetchUsers(); // Refresh the list
            } catch (err) {
                alert("Failed to promote user.");
            }
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Resident Management</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Email</th>
                            <th className="px-6 py-3 text-left">Current Role</th>
                            <th className="px-6 py-3 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b">
                                <td className="px-6 py-4">{user.fullName}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-sm ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user.role !== 'ADMIN' && (
                                        <button
                                            onClick={() => handlePromote(user.id, user.fullName)}
                                            className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition"
                                        >
                                            Promote to Admin
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;