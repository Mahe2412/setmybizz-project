"use client";
import React from 'react';
import { Navbar } from '@/app/components/Navbar';
import { ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Workspace() {
    const tasks = [
        { title: "Digital Signature Certificate (DSC)", status: "completed", date: "Oct 20, 2024" },
        { title: "Director Identification Number (DIN)", status: "completed", date: "Oct 22, 2024" },
        { title: "Name Approval", status: "process", date: "Est. Oct 25, 2024" },
        { title: "Incorporation Certificate (COI)", status: "pending", date: "Upcoming" },
        { title: "PAN & TAN Allocation", status: "pending", date: "Upcoming" }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="pt-24 px-6 pb-20 max-w-5xl mx-auto">
                <Link href="/dashboard" className="text-slate-400 font-bold text-sm mb-6 inline-flex items-center hover:text-blue-600 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>

                <header className="mb-8">
                    <h1 className="text-3xl font-black italic text-slate-900 mb-2">My Workspace</h1>
                    <p className="text-slate-500 font-bold">Track your incorporation progress in real-time.</p>
                </header>

                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-slate-900">Incorporation Timeline</h2>
                            <span className="bg-blue-100 text-blue-700 font-bold text-xs px-3 py-1 rounded-full uppercase">Active</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 mt-4 overflow-hidden">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <p className="text-right text-xs font-bold text-slate-400 mt-2">45% Completed</p>
                    </div>

                    <div className="p-0">
                        {tasks.map((task, index) => (
                            <div key={index} className="p-6 border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors flex items-center gap-4 group">
                                <div className="flex-shrink-0">
                                    {task.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                                    {task.status === 'process' && <Clock className="w-6 h-6 text-blue-600 animate-pulse" />}
                                    {task.status === 'pending' && <Circle className="w-6 h-6 text-slate-200" />}
                                </div>
                                <div className="flex-grow">
                                    <h3 className={`font-bold ${task.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>{task.title}</h3>
                                    <p className="text-xs font-bold text-slate-400">{task.date}</p>
                                </div>
                                <div className="text-right">
                                    {task.status === 'process' && (
                                        <button className="text-xs bg-blue-600 text-white px-4 py-2 rounded-full font-bold">View Status</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
