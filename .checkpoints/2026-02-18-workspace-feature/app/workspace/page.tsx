"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/app/components/Navbar";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PackageService {
    name: string;
    included: boolean;
}

interface Addon {
    id: string;
    name: string;
    description: string;
    price: number;
    emoji: string;
    popular?: boolean;
}

interface PurchaseData {
    packageId: string;
    packageName: string;
    packageEmoji: string;
    packageColor: string;
    services: PackageService[];
    addons: Addon[];
    totalPrice: number;
    purchasedAt: string;
    userName: string;
    userPhone: string;
    userEmail: string;
}

type ServiceStatus = "pending" | "in_progress" | "completed" | "uploaded";

interface ServiceState {
    name: string;
    status: ServiceStatus;
    uploadedFile?: string;
    isAddon?: boolean;
    addonEmoji?: string;
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────
function UploadModal({
    serviceName,
    onUpload,
    onClose,
}: {
    serviceName: string;
    onUpload: (fileName: string) => void;
    onClose: () => void;
}) {
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState("");

    const handleFile = (file: File) => {
        setFileName(file.name);
    };

    return (
        <div className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Upload Documents</p>
                            <h3 className="text-base font-black leading-tight">{serviceName}</h3>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
                            <span className="material-icons text-sm">close</span>
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <div
                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${dragging ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"}`}
                        onClick={() => document.getElementById("file-input")?.click()}
                    >
                        <span className="material-icons text-4xl text-slate-300 mb-3 block">cloud_upload</span>
                        {fileName ? (
                            <p className="text-sm font-black text-indigo-600">{fileName}</p>
                        ) : (
                            <>
                                <p className="text-sm font-bold text-slate-600">Drop files here or click to browse</p>
                                <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                            </>
                        )}
                        <input
                            id="file-input"
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                        />
                    </div>

                    <div className="mt-4 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Required Documents</p>
                        {["Aadhaar Card", "PAN Card", "Address Proof", "Passport Photo"].map(doc => (
                            <div key={doc} className="flex items-center gap-2 text-xs text-slate-600">
                                <span className="material-icons text-sm text-slate-300">radio_button_unchecked</span>
                                {doc}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 mt-5">
                        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={() => { if (fileName) { onUpload(fileName); onClose(); } }}
                            disabled={!fileName}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${fileName ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/30" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                        >
                            Upload Document
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ServiceStatus }) {
    const config = {
        pending: { label: "Pending", color: "bg-slate-100 text-slate-500", icon: "schedule" },
        in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-600", icon: "autorenew" },
        completed: { label: "Completed", color: "bg-green-100 text-green-600", icon: "check_circle" },
        uploaded: { label: "Docs Uploaded", color: "bg-amber-100 text-amber-600", icon: "upload_file" },
    };
    const c = config[status];
    return (
        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${c.color}`}>
            <span className={`material-icons text-[11px] ${status === "in_progress" ? "animate-spin" : ""}`}>{c.icon}</span>
            {c.label}
        </span>
    );
}

// ─── Add Services Modal ───────────────────────────────────────────────────────
const ALL_EXTRA_SERVICES = [
    { name: "GST Registration", emoji: "📋", price: 1499, description: "Goods & Services Tax registration" },
    { name: "Trademark Registration", emoji: "™️", price: 6999, description: "Protect your brand name & logo" },
    { name: "FSSAI License", emoji: "🍽️", price: 2499, description: "Mandatory for food businesses" },
    { name: "IEC Code", emoji: "🌐", price: 1999, description: "Import Export Code for trading" },
    { name: "Professional Tax", emoji: "📊", price: 1999, description: "State-level PT registration" },
    { name: "ROC Annual Filing", emoji: "🗂️", price: 4999, description: "MCA annual return filing" },
    { name: "Virtual Office Address", emoji: "🏢", price: 3999, description: "Premium business address (1 year)" },
    { name: "CA Support (Annual)", emoji: "👨‍💼", price: 9999, description: "ITR, GST, MCA compliance" },
];

function AddServicesModal({
    existingServices,
    onAdd,
    onClose,
}: {
    existingServices: string[];
    onAdd: (services: { name: string; emoji: string; price: number }[]) => void;
    onClose: () => void;
}) {
    const [selected, setSelected] = useState<string[]>([]);
    const available = ALL_EXTRA_SERVICES.filter(s => !existingServices.includes(s.name));
    const total = ALL_EXTRA_SERVICES.filter(s => selected.includes(s.name)).reduce((sum, s) => sum + s.price, 0);

    return (
        <div className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Expand Your Business</p>
                            <h3 className="text-base font-black">Add More Services</h3>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
                            <span className="material-icons text-sm">close</span>
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-2">
                    {available.map(svc => {
                        const isSelected = selected.includes(svc.name);
                        return (
                            <button
                                key={svc.name}
                                onClick={() => setSelected(prev => isSelected ? prev.filter(s => s !== svc.name) : [...prev, svc.name])}
                                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${isSelected ? "border-emerald-500 bg-emerald-50" : "border-slate-100 hover:border-emerald-200 hover:bg-slate-50"}`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-emerald-500 border-emerald-500" : "border-slate-300"}`}>
                                    {isSelected && <span className="material-icons text-white text-[10px]">check</span>}
                                </div>
                                <span className="text-xl flex-shrink-0">{svc.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-black ${isSelected ? "text-emerald-900" : "text-slate-800"}`}>{svc.name}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{svc.description}</p>
                                </div>
                                <span className={`text-xs font-black flex-shrink-0 ${isSelected ? "text-emerald-600" : "text-slate-600"}`}>
                                    +₹{svc.price.toLocaleString()}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <div className="p-5 border-t border-slate-100 flex-shrink-0">
                    {selected.length > 0 && (
                        <div className="flex justify-between text-xs font-black text-slate-700 mb-3">
                            <span>{selected.length} service{selected.length > 1 ? "s" : ""} selected</span>
                            <span className="text-emerald-600">+₹{total.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                const toAdd = ALL_EXTRA_SERVICES.filter(s => selected.includes(s.name));
                                onAdd(toAdd);
                                onClose();
                            }}
                            disabled={selected.length === 0}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${selected.length > 0 ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                        >
                            Add Services →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Guest View ───────────────────────────────────────────────────────────────
function GuestView() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
            <Navbar />
            <main className="pt-24 px-6 pb-20 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                        <span className="material-icons text-4xl text-indigo-500">lock</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Your Workspace</h1>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                        Purchase a package to unlock your personal business dashboard — track services, upload documents, and monitor progress.
                    </p>
                </div>

                {/* Preview card */}
                <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-6 relative">
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                        <div className="bg-indigo-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg mb-2">
                            🔒 Purchase to Unlock
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Your dashboard will appear here</p>
                    </div>
                    <div className="p-5 opacity-40 pointer-events-none select-none">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-100 rounded-2xl" />
                            <div>
                                <div className="h-3 w-32 bg-slate-200 rounded mb-1" />
                                <div className="h-2 w-20 bg-slate-100 rounded" />
                            </div>
                        </div>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-3 py-3 border-b border-slate-50">
                                <div className="w-5 h-5 rounded-full bg-slate-100" />
                                <div className="flex-1 h-2.5 bg-slate-100 rounded" />
                                <div className="w-16 h-7 bg-slate-100 rounded-lg" />
                                <div className="w-16 h-7 bg-slate-100 rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>

                <Link
                    href="/incorporation"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-sm shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all"
                >
                    <span className="material-icons text-sm">rocket_launch</span>
                    Choose a Package →
                </Link>
                <p className="text-xs text-slate-400 mt-3">Starting from ₹4,999 · All-inclusive</p>
            </main>
        </div>
    );
}

// ─── Main Workspace Dashboard ─────────────────────────────────────────────────
export default function WorkspacePage() {
    const [purchase, setPurchase] = useState<PurchaseData | null>(null);
    const [services, setServices] = useState<ServiceState[]>([]);
    const [uploadingFor, setUploadingFor] = useState<string | null>(null);
    const [showAddServices, setShowAddServices] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const raw = localStorage.getItem("smb_purchased_package");
        if (raw) {
            try {
                const data: PurchaseData = JSON.parse(raw);
                setPurchase(data);

                // Build service states from package services (included only) + addons
                const svcStates: ServiceState[] = [
                    ...data.services
                        .filter(s => s.included)
                        .map(s => ({ name: s.name, status: "pending" as ServiceStatus })),
                    ...data.addons.map(a => ({
                        name: a.name,
                        status: "pending" as ServiceStatus,
                        isAddon: true,
                        addonEmoji: a.emoji,
                    })),
                ];
                setServices(svcStates);
            } catch {
                // ignore parse errors
            }
        }
        setLoaded(true);
    }, []);

    const completedCount = services.filter(s => s.status === "completed").length;
    const progressPct = services.length > 0 ? Math.round((completedCount / services.length) * 100) : 0;

    const handleUpload = (serviceName: string, fileName: string) => {
        setServices(prev =>
            prev.map(s => s.name === serviceName ? { ...s, status: "uploaded", uploadedFile: fileName } : s)
        );
    };

    const handleAddServices = (newSvcs: { name: string; emoji: string; price: number }[]) => {
        setServices(prev => [
            ...prev,
            ...newSvcs.map(s => ({ name: s.name, status: "pending" as ServiceStatus, isAddon: true, addonEmoji: s.emoji })),
        ]);
    };

    if (!loaded) return null;
    if (!purchase) return <GuestView />;

    const purchaseDate = new Date(purchase.purchasedAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/10">
            <Navbar />

            {uploadingFor && (
                <UploadModal
                    serviceName={uploadingFor}
                    onUpload={(fileName) => handleUpload(uploadingFor, fileName)}
                    onClose={() => setUploadingFor(null)}
                />
            )}

            {showAddServices && (
                <AddServicesModal
                    existingServices={services.map(s => s.name)}
                    onAdd={handleAddServices}
                    onClose={() => setShowAddServices(false)}
                />
            )}

            <main className="pt-24 px-4 pb-28 max-w-3xl mx-auto">

                {/* Back link */}
                <Link href="/dashboard" className="text-slate-400 font-bold text-xs mb-6 inline-flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                    <span className="material-icons text-sm">arrow_back</span>
                    Back to Dashboard
                </Link>

                {/* Package Header Card */}
                <div className={`bg-gradient-to-r ${purchase.packageColor} rounded-3xl p-6 text-white mb-5 shadow-xl`}>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">My Package</p>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-3xl">{purchase.packageEmoji}</span>
                                <h1 className="text-xl font-black">{purchase.packageName}</h1>
                            </div>
                            <p className="text-xs opacity-70">Purchased on {purchaseDate}</p>
                            <p className="text-xs opacity-70 mt-0.5">
                                {purchase.userName} · {purchase.userPhone}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black">₹{purchase.totalPrice.toLocaleString()}</div>
                            <div className="text-[10px] opacity-70 uppercase tracking-wider">Total Paid</div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-5">
                        <div className="flex justify-between text-xs font-bold mb-2 opacity-80">
                            <span>Overall Progress</span>
                            <span>{progressPct}% Complete</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-white h-2.5 rounded-full transition-all duration-700"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                        <p className="text-[10px] opacity-60 mt-1.5">{completedCount} of {services.length} services completed</p>
                    </div>
                </div>

                {/* Services List */}
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden mb-4">
                    <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-black text-slate-900">Your Services</h2>
                            <p className="text-[10px] text-slate-400 mt-0.5">Upload documents &amp; track status for each service</p>
                        </div>
                        <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">
                            {services.length} Services
                        </span>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {services.map((svc, idx) => (
                            <div
                                key={idx}
                                className="px-6 py-4 hover:bg-slate-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Icon */}
                                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${svc.status === "completed" ? "bg-green-100" :
                                            svc.status === "in_progress" ? "bg-blue-100" :
                                                svc.status === "uploaded" ? "bg-amber-100" :
                                                    "bg-slate-100"
                                        }`}>
                                        {svc.isAddon ? (
                                            <span className="text-base">{svc.addonEmoji}</span>
                                        ) : (
                                            <span className={`material-icons text-sm ${svc.status === "completed" ? "text-green-500" :
                                                    svc.status === "in_progress" ? "text-blue-500" :
                                                        svc.status === "uploaded" ? "text-amber-500" :
                                                            "text-slate-400"
                                                }`}>
                                                {svc.status === "completed" ? "check_circle" :
                                                    svc.status === "in_progress" ? "autorenew" :
                                                        svc.status === "uploaded" ? "upload_file" :
                                                            "radio_button_unchecked"}
                                            </span>
                                        )}
                                    </div>

                                    {/* Name & status */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-bold text-slate-800 truncate">{svc.name}</p>
                                            {svc.isAddon && (
                                                <span className="text-[8px] font-black bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0">
                                                    Add-on
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-1">
                                            <StatusBadge status={svc.status} />
                                        </div>
                                        {svc.uploadedFile && (
                                            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                                <span className="material-icons text-[11px]">attach_file</span>
                                                {svc.uploadedFile}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => setUploadingFor(svc.name)}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[11px] font-black transition-all hover:scale-[1.02]"
                                        >
                                            <span className="material-icons text-sm">upload_file</span>
                                            Upload
                                        </button>
                                        <button
                                            onClick={() => {
                                                setServices(prev => prev.map((s, i) =>
                                                    i === idx ? { ...s, status: s.status === "completed" ? "pending" : "in_progress" } : s
                                                ));
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-[11px] font-black transition-all hover:scale-[1.02]"
                                        >
                                            <span className="material-icons text-sm">track_changes</span>
                                            Status
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Services Button */}
                    <div className="px-6 py-4 border-t border-slate-50">
                        <button
                            onClick={() => setShowAddServices(true)}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black text-sm transition-all hover:scale-[1.01] hover:border-emerald-400"
                        >
                            <span className="material-icons text-sm">add_circle</span>
                            Add More Services
                        </button>
                    </div>
                </div>

                {/* Add-ons Summary (if any were purchased) */}
                {purchase.addons.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden mb-4">
                        <div className="px-6 py-4 border-b border-slate-50">
                            <h2 className="text-sm font-black text-slate-900">Purchased Add-ons</h2>
                            <p className="text-[10px] text-slate-400 mt-0.5">Additional services included in your order</p>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {purchase.addons.map((addon, idx) => (
                                <div key={idx} className="px-6 py-3.5 flex items-center gap-3">
                                    <span className="text-xl">{addon.emoji}</span>
                                    <div className="flex-1">
                                        <p className="text-xs font-black text-slate-800">{addon.name}</p>
                                        <p className="text-[10px] text-slate-400">{addon.description}</p>
                                    </div>
                                    <span className="text-xs font-black text-indigo-600">₹{addon.price.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Support Card */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-5 text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                            <span className="material-icons text-lg">support_agent</span>
                        </div>
                        <div>
                            <p className="text-sm font-black">Need Help?</p>
                            <p className="text-[10px] opacity-60">Our experts are here for you</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <a href="tel:+919999999999" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors">
                            <span className="material-icons text-sm">call</span>
                            Call Us
                        </a>
                        <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-500 hover:bg-green-400 rounded-xl text-xs font-bold transition-colors">
                            <span className="material-icons text-sm">chat</span>
                            WhatsApp
                        </a>
                        <Link href="/incorporation" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-500 hover:bg-indigo-400 rounded-xl text-xs font-bold transition-colors">
                            <span className="material-icons text-sm">add_shopping_cart</span>
                            Upgrade
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    );
}
