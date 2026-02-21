"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, limit, where } from 'firebase/firestore';
import { Lead } from '@/types';

// ─── Sub-Dashboard Components ───

function BusinessSetupDashboard() {
    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <DashboardStat title="Pending Applications" value="12" icon="pending_actions" color="amber" />
                <DashboardStat title="DSC Processing" value="4" icon="fingerprint" color="indigo" />
                <DashboardStat title="Name Approval" value="7" icon="check_circle" color="green" />
                <DashboardStat title="Queries Raised" value="2" icon="help" color="rose" />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                         <h3 className="font-bold text-slate-800">Recent Applications</h3>
                         <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">View All</button>
                    </div>
                    {/* Placeholder Table */}
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">AB</div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Alpha Business LLP</p>
                                        <p className="text-[10px] text-slate-400">Pvt Ltd • Maharashtra</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-1 rounded-full uppercase tracking-wider">In Progress</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Team Activity</h3>
                    <div className="space-y-4">
                         {/* Activity Items */}
                         <div className="flex gap-3">
                             <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500" />
                             <div>
                                 <p className="text-xs text-slate-600"><span className="font-bold text-slate-900">Sarah</span> updated DSC status for <span className="font-bold text-slate-900">TechFlow Inc</span></p>
                                 <p className="text-[10px] text-slate-400 mt-1">2 mins ago</p>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LaunchPadDashboard() {
    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DashboardStat title="Total Service Revenue" value="₹4.2L" icon="payments" color="emerald" />
                <DashboardStat title="Active Partners" value="18" icon="handshake" color="blue" />
                <DashboardStat title="New Requests" value="34" icon="new_releases" color="purple" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                 <h3 className="font-bold text-slate-800 mb-6">Service Catalog Performance</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {['GST Registration', 'Trademark', 'FSSAI License', 'Web Development'].map((svc, i) => (
                         <DashboardCard key={i} title={svc} value={`${Math.floor(Math.random() * 50)} Orders`} icon="shopping_bag" color="indigo" />
                     ))}
                 </div>
            </div>
        </div>
    );
}

function LearnDashboard() {
    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DashboardStat title="Total Students" value="154" icon="school" color="orange" />
                <DashboardStat title="Course Completions" value="85%" icon="emoji_events" color="yellow" />
                <DashboardStat title="Content Views" value="1.2K" icon="visibility" color="cyan" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                     <h3 className="font-bold text-slate-800 mb-4">Top Performing Courses</h3>
                 </div>
                 <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                     <h3 className="font-bold text-slate-800 mb-4">Content Calendar</h3>
                 </div>
             </div>
        </div>
    );
}

// 1. Workspace Dashboard (The Main CRM)
function WorkspaceDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    
    useEffect(() => {
        const q = query(
            collection(db, "leads"),
            orderBy("createdAt", "desc"),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const leadsData = snapshot.docs.map(doc => ({
                leadId: doc.id, // Assuming doc.id should be mapped to leadId
                ...doc.data()
            })) as Lead[];
            setLeads(leadsData);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             {/* CRM Stats */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <DashboardStat title="Total Leads" value={leads.length.toString()} icon="groups" color="indigo" />
                <DashboardStat title="Hot Leads" value={leads.filter(l => l.status === 'new').length.toString()} icon="local_fire_department" color="rose" />
                <DashboardStat title="Conversion Rate" value="12%" icon="trending_up" color="emerald" />
                <DashboardStat title="Avg. Deal Size" value="₹18k" icon="attach_money" color="blue" />
            </div>

            {/* Live Feed Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="font-bold text-slate-800">Live Lead Feed</h3>
                        <p className="text-xs text-slate-400">Real-time updates from user onboarding</p>
                    </div>
                    <button className="text-xs font-bold bg-slate-900 text-white px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors">Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Business</th>
                                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leads.map((lead) => (
                                <tr key={lead.leadId} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                                                {lead.businessData?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{lead.businessData?.name || 'Unknown User'}</p>
                                                <p className="text-[10px] text-slate-500">{lead.contact?.email || 'No Email'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-icons text-slate-300 text-sm">business</span>
                                            <span className="text-xs font-semibold text-slate-700">{lead.businessData?.businessName || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                            lead.status === 'new' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${lead.status === 'new' ? 'bg-indigo-500' : 'bg-slate-400'}`} />
                                            {lead.status || 'New'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-semibold text-slate-500 lowercase">
                                        {lead.createdAt ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                                            <span className="material-icons text-lg">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ─── Component Switcher ───

function AdminPageContent() {
    const searchParams = useSearchParams();
    const view = searchParams.get('view') || 'workspace';

    switch (view) {
        case 'business_setup':
            return <BusinessSetupDashboard />;
        case 'launch_pad':
            return <LaunchPadDashboard />;
        case 'learn':
            return <LearnDashboard />;
        case 'workspace':
        default:
            return <WorkspaceDashboard />;
    }
}

export default function AdminPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center p-12"><span className="material-icons animate-spin text-slate-400">sync</span></div>}>
             <AdminPageContent />
        </Suspense>
    );
}

// ─── Helpers ───

function DashboardStat({ title, value, icon, color }: { title: string, value: string, icon: string, color: string }) {
     const colorMap: any = { indigo: 'text-indigo-600 bg-indigo-50', emerald: 'text-emerald-600 bg-emerald-50', amber: 'text-amber-600 bg-amber-50', rose: 'text-rose-600 bg-rose-50', blue: 'text-blue-600 bg-blue-50', purple: 'text-purple-600 bg-purple-50', orange: 'text-orange-600 bg-orange-50', yellow: 'text-yellow-600 bg-yellow-50', cyan: 'text-cyan-600 bg-cyan-50' };
     const style = colorMap[color] || colorMap.indigo;

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style}`}>
                <span className="material-icons text-2xl">{icon}</span>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
                <p className="text-2xl font-black text-slate-900">{value}</p>
            </div>
        </div>
    );
}

function DashboardCard({ title, value, icon, color }: any) {
    const colorMap: any = { indigo: 'text-indigo-600 bg-indigo-50' }; 
    return (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all text-center">
             <div className="w-10 h-10 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-600 mb-2">
                 <span className="material-icons">{icon}</span>
             </div>
             <p className="text-xs font-bold text-slate-400">{title}</p>
             <p className="text-lg font-black text-slate-800">{value}</p>
        </div>
    );
}
