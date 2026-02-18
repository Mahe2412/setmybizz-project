"use client";

import { Lead } from '@/types/lead'; // We will define this type locally if needed or in a types file

export interface LeadTableProps {
    leads: any[]; // using any for now, ideally strictly typed
    role: 'SUPER_ADMIN' | 'GST_EXPERT';
    loading: boolean;
}

export default function LeadTable({ leads, role, loading }: LeadTableProps) {

    // Filter leads based on role
    // SUPER_ADMIN sees ALL.
    // GST_EXPERT sees ONLY "GST" or related nature/business leads.
    // For demo: if businessName or nature contains "GST", it's a GST lead.

    const filteredLeads = leads.filter(lead => {
        if (role === 'SUPER_ADMIN') return true;
        if (role === 'GST_EXPERT') {
            const nature = lead.nature?.toLowerCase() || '';
            const businessName = lead.businessName?.toLowerCase() || '';
            // Simple logic: matches if "Consulting" (from our test) or "GST" is mentioned.
            return nature.includes('consulting') || nature.includes('gst') || businessName.includes('gst');
        }
        return false;
    });

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nature</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expert Rec.</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    <p className="mt-2">Loading leads...</p>
                                </td>
                            </tr>
                        ) : filteredLeads.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No leads found for this view.
                                </td>
                            </tr>
                        ) : (
                            filteredLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {lead.createdAt?.seconds ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{lead.businessName}</div>
                                        <div className="text-sm text-gray-500">{lead.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {lead.nature || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {/* Logic: Registered if phone exists, else Guest (simplified) */}
                                        {lead.phone ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Registered
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                Guest Type
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {lead.aiSummary || 'Analysis pending...'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
