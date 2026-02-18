"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase'; // Ensure this path is correct
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';

interface UserProfile {
    id: string; // Added id property
    uid?: string;
    displayName: string;
    email: string;
    createdAt?: any;
    businessProfile?: {
        incorporationStatus?: 'Pending' | 'In Progress' | 'Completed' | 'Rejected';
        gstStatus?: 'Pending' | 'Applied' | 'Approved';
        [key: string]: any;
    };
}

export default function OperationsTab() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusUpdateMsg, setStatusUpdateMsg] = useState("");
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    useEffect(() => {
        // Query "users" collection (assuming you have one with profiles)
        // If not, we might need to rely on "leads" that have converted to users, or ensure
        // your auth flow saves to a 'users' collection.
        // For now, let's assume we are querying the 'users' collection.
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as any[];
            setUsers(usersData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleUpdateStatus = async (uid: string, type: 'incorporation' | 'gst', status: string) => {
        try {
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {
                [`businessProfile.${type}Status`]: status
            });
            alert(`Updated ${type} status to ${status}`);
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const sendAdminUpdate = async (uid: string) => {
        if (!statusUpdateMsg) return;
        try {
            await addDoc(collection(db, `users/${uid}/notifications`), {
                message: statusUpdateMsg,
                type: 'admin_update',
                createdAt: serverTimestamp(),
                read: false
            });
            setStatusUpdateMsg("");
            setSelectedUser(null);
            alert("Update sent to user!");
        } catch (error) {
            console.error("Error sending update:", error);
            alert("Failed to send update");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Operations Command Center</h3>
                <p className="text-sm text-gray-500">Manage client statuses and send updates.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incorporation</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={4} className="p-4 text-center">Loading clients...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={4} className="p-4 text-center">No registered clients found.</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.uid || user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{user.displayName || 'No Name'}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            className="text-xs border rounded p-1 bg-white"
                                            value={user.businessProfile?.incorporationStatus || 'Pending'}
                                            onChange={(e) => handleUpdateStatus(user.id, 'incorporation', e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            className="text-xs border rounded p-1 bg-white"
                                            value={user.businessProfile?.gstStatus || 'Pending'}
                                            onChange={(e) => handleUpdateStatus(user.id, 'gst', e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Applied">Applied</option>
                                            <option value="Approved">Approved</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setSelectedUser(user.id)}
                                            className="text-blue-600 hover:text-blue-900 text-xs font-bold uppercase"
                                        >
                                            Send Update
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Simple Modal for Sending Update */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                        <h3 className="font-bold text-lg mb-4">Send Update to Client</h3>
                        <textarea
                            className="w-full border p-2 rounded mb-4 text-sm"
                            rows={4}
                            placeholder="Type update message (e.g., 'Your GST application has been submitted, allow 2-3 days.')"
                            value={statusUpdateMsg}
                            onChange={(e) => setStatusUpdateMsg(e.target.value)}
                        />
                        <div className="flex justifying-end gap-2">
                            <button onClick={() => setSelectedUser(null)} className="px-4 py-2 text-gray-600 text-sm">Cancel</button>
                            <button onClick={() => sendAdminUpdate(selectedUser)} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold">Send</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
