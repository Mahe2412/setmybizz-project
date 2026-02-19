"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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
    downloadUrl?: string;
    isAddon?: boolean;
    addonEmoji?: string;
}

// ─── Document Upload Modal ───
function UploadModal({
    serviceName,
    onUpload,
    onClose,
}: {
    serviceName: string;
    onUpload: (file: File) => Promise<void>;
    onClose: () => void;
}) {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFile = (f: File) => {
        setFile(f);
    };

    const handleUploadClick = async () => {
        if (!file) return;
        setIsUploading(true);
        try {
            await onUpload(file);
            onClose();
        } catch (error) {
            console.error("Upload failed", error);
            // Optionally handle error state here
        } finally {
            setIsUploading(false);
        }
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
                        {file ? (
                            <p className="text-sm font-black text-indigo-600">{file.name}</p>
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
                        <button onClick={onClose} disabled={isUploading} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button
                            onClick={handleUploadClick}
                            disabled={!file || isUploading}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${file ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/30" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                        >
                            {isUploading ? (
                                <>
                                    <span className="material-icons text-sm animate-spin">autorenew</span>
                                    Uploading...
                                </>
                            ) : (
                                "Upload Document"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Status Badge ───
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

// ─── Main Widget Component ───
export default function IncorporationWidget({ onNavigate }: { onNavigate?: (tab: 'A') => void }) {
    const [purchase, setPurchase] = useState<PurchaseData | null>(null);
    const [services, setServices] = useState<ServiceState[]>([]);
    const [uploadModal, setUploadModal] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("smb_purchased_package");
        if (saved) {
            try {
                const data: PurchaseData = JSON.parse(saved);
                setPurchase(data);

                // Initialize services status
                const initServices: ServiceState[] = data.services
                    .filter(s => s.included)
                    .map(s => ({ name: s.name, status: "pending" }));

                // Add addons
                data.addons.forEach(a => {
                    initServices.push({
                        name: a.name,
                        status: "pending",
                        isAddon: true,
                        addonEmoji: a.emoji
                    });
                });

                // Check previously saved status
                const savedStatus = localStorage.getItem("smb_services_status");
                if (savedStatus) {
                    setServices(JSON.parse(savedStatus));
                } else {
                    setServices(initServices);
                }
            } catch (e) {
                console.error("Error parsing purchase data", e);
            }
        }
    }, []);

    const handleUpload = async (file: File) => {
        if (!uploadModal || !purchase) return;

        // Create a storage ref -> uploads/userName/serviceName/fileName
        // Sanitizing names to avoid path issues
        const safeUserName = purchase.userName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const safeServiceName = uploadModal.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const storageRef = ref(storage, `uploads/${safeUserName}/${safeServiceName}/${file.name}`);

        try {
            // Upload the file
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            // Wait for upload to complete
            await new Promise<void>((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        reject(error);
                    },
                    () => {
                        // Handle successful uploads on complete
                        resolve();
                    }
                );
            });

            // Get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const updated = services.map(s =>
                s.name === uploadModal ? { 
                    ...s, 
                    status: "uploaded" as ServiceStatus, 
                    uploadedFile: file.name,
                    downloadUrl: downloadURL
                } : s
            );
            
            setServices(updated);
            localStorage.setItem("smb_services_status", JSON.stringify(updated));
            setUploadModal(null);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file. Please try again.");
        }
    };

    if (!purchase) {
        return (
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden mb-8 group cursor-pointer" onClick={() => onNavigate?.('A')}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                            <span className="material-icons text-3xl text-indigo-300">rocket_launch</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-black mb-1">Start Your Business</h2>
                            <p className="text-indigo-200 text-sm max-w-sm">
                                Incorporate your company, get GST, and protect your brand with our AI-powered legal stack.
                            </p>
                        </div>
                    </div>
                     <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold text-sm shadow-lg hover:shadow-white/20 transition-all flex items-center gap-2 group-hover:gap-3">
                        Get Started <span className="material-icons text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className={`bg-gradient-to-r ${purchase.packageColor || 'from-indigo-600 to-purple-600'} rounded-t-3xl p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
                   <span className="material-icons text-[150px]">rocket_launch</span>
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                            {purchase.packageEmoji}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Active Plan</p>
                            <h2 className="text-2xl font-black">{purchase.packageName}</h2>
                            <p className="text-sm opacity-90 flex items-center gap-2">
                                <span className="material-icons text-sm">verified</span> Verified Purchase
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 min-w-[200px]">
                        <p className="text-[10px] uppercase font-bold opacity-70 mb-1">Total Progress</p>
                        <div className="flex items-end justify-between mb-1">
                             <span className="text-2xl font-black">{Math.round((services.filter(s=>s.status!=='pending').length / services.length) * 100)}%</span>
                             <span className="text-xs font-medium opacity-80">{services.filter(s=>s.status!=='pending').length}/{services.length} Completed</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                             <div 
                                className="bg-white h-full rounded-full transition-all duration-1000" 
                                style={{ width: `${(services.filter(s=>s.status!=='pending').length / services.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 border-t-0 rounded-b-3xl p-6 shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide">Included Services</h3>
                    <span className="text-xs font-bold text-slate-400">Status & Actions</span>
                </div>
                
                <div className="space-y-3">
                    {services.map((service, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all group bg-slate-50/50 gap-4 sm:gap-0">
                             <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${service.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                                    <span className="material-icons text-sm">
                                        {service.isAddon ? (service.addonEmoji || 'extension') : (service.status === 'completed' ? 'check' : 'business_center')}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-sm text-slate-800 truncate pr-2">{service.name}</h4>
                                    {service.isAddon && <span className="text-[9px] font-black uppercase tracking-wider text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-full">Add-on</span>}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 self-end sm:self-auto">
                                <StatusBadge status={service.status} />
                                {service.status === 'pending' && (
                                    <button 
                                        onClick={() => setUploadModal(service.name)}
                                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 active:scale-95"
                                    >
                                        Upload
                                    </button>
                                )}
                                {service.status === 'uploaded' && (
                                    <div className="flex items-center gap-3">
                                        {service.downloadUrl && (
                                            <a 
                                                href={service.downloadUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
                                                title="View Document"
                                            >
                                                <span className="material-icons text-sm">visibility</span> View
                                            </a>
                                        )}
                                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                            <span className="material-icons text-sm">check_circle</span> Done
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {uploadModal && (
                <UploadModal
                    serviceName={uploadModal}
                    onUpload={handleUpload}
                    onClose={() => setUploadModal(null)}
                />
            )}
        </div>
    );
}
