"use client";

export default function DocumentVault() {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-gray-400 text-3xl">folder_off</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Document Vault</h3>
            <p className="text-gray-500 mt-2">
                This module will allow you to browse client documents (PAN, Aadhar, Bills) uploaded to Firebase Storage.
                <br />
                <span className="text-xs text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded mt-2 inline-block">COMING SOON</span>
            </p>
        </div>
    );
}
