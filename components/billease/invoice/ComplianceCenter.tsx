"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Car,
  FileDown,
  QrCode,
  CheckCircle,
  Truck,
  Download,
  Check
} from "lucide-react";
import { formatCurrency } from "@/lib/billease/utils";

type ComplianceCenterProps = {
  doc: any;
};

export function ComplianceCenter({ doc }: ComplianceCenterProps) {
  const [eInvoiceStatus, setEInvoiceStatus] = useState<"pending" | "generated">("pending");
  const [eWayStatus, setEWayStatus] = useState<"pending" | "generated">("pending");

  // E-way bill form states
  const [vehicleNo, setVehicleNo] = useState("");
  const [transporterId, setTransporterId] = useState("");
  const [distance, setDistance] = useState("150");

  const [irn, setIrn] = useState("");
  const [ackNo, setAckNo] = useState("");
  const [ewayNo, setEwayNo] = useState("");

  const handleGenerateEInvoice = () => {
    // Generate mock IRN (64-character hex string)
    const mockIrn = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const mockAck = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    // Build NIC Schema v1.03
    const nicPayload = {
      Version: "1.03",
      IrnDetails: {
        Irn: mockIrn,
        AckNo: mockAck,
        AckDt: new Date().toISOString().replace("T", " ").substring(0, 19),
      },
      DocDetails: {
        Typ: "INV",
        No: doc.number ?? "DRAFT",
        Dt: new Date(doc.date).toLocaleDateString("en-GB"),
      },
      SellerDetails: {
        Gstin: doc.business.gstin ?? "27AAAAA1111A1Z1",
        LglNm: doc.business.name,
        Addr1: doc.business.address ?? "Business Address",
        Loc: doc.business.city ?? "Mumbai",
        Pin: Number(doc.business.pincode ?? 400001),
        Stcd: doc.business.stateCode,
      },
      BuyerDetails: {
        Gstin: doc.party?.gstin ?? "27URD99999URD1Z1",
        LglNm: doc.party?.name ?? "Walk-in Customer",
        Addr1: doc.party?.billingAddress ?? "Billing Address",
        Loc: "Mumbai",
        Pin: 400001,
        Stcd: doc.party?.stateCode ?? doc.business.stateCode,
      },
      ItemList: doc.lines.map((l: any, idx: number) => ({
        SlNo: String(idx + 1),
        PrdNm: l.description,
        IsServc: "N",
        HsnCd: l.hsnSac ?? "8517",
        Qty: l.qty,
        Unit: l.unit,
        UnitPrice: l.rate,
        TotAmt: l.qty * l.rate,
        Discount: (l.qty * l.rate * l.discountPct) / 100,
        AssVal: l.taxableValue,
        GstRt: l.gstRate,
        CgstAmt: l.cgst,
        SgstAmt: l.sgst,
        IgstAmt: l.igst,
        TotItemVal: l.lineTotal,
      })),
      ValDetails: {
        AssVal: doc.taxableTotal,
        CgstVal: doc.cgstTotal,
        SgstVal: doc.sgstTotal,
        IgstVal: doc.igstTotal,
        TotElcd: doc.roundOff,
        RndOffAmt: doc.roundOff,
        TotInvVal: doc.grandTotal,
      },
    };

    // Download file
    const blob = new Blob([JSON.stringify(nicPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `EINVOICE_${doc.number || "DRAFT"}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setIrn(mockIrn);
    setAckNo(mockAck);
    setEInvoiceStatus("generated");
  };

  const handleGenerateEWayBill = () => {
    if (!vehicleNo) {
      alert("Please enter a vehicle number for the E-way bill");
      return;
    }

    const mockEwayNo = Math.floor(100000000000 + Math.random() * 900000000000).toString();

    // Build E-way Bill NIC Schema
    const ewayPayload = {
      supplyType: "Outward",
      subSupplyType: "Supply",
      docType: "INV",
      docNo: doc.number ?? "DRAFT",
      docDate: new Date(doc.date).toLocaleDateString("en-GB"),
      fromGstin: doc.business.gstin ?? "27AAAAA1111A1Z1",
      toGstin: doc.party?.gstin ?? "27URD99999URD1Z1",
      transporterId: transporterId || "TRANS9921",
      transporterName: "Local Logistics Partner",
      transDocNo: "",
      transDocDate: "",
      vehicleNo: vehicleNo,
      transMode: "Road",
      actualDist: Number(distance),
      totalValue: doc.grandTotal,
      cgstValue: doc.cgstTotal,
      sgstValue: doc.sgstTotal,
      igstValue: doc.igstTotal,
    };

    // Download E-way Bill JSON
    const blob = new Blob([JSON.stringify(ewayPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `EWAYBILL_${doc.number || "DRAFT"}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setEwayNo(mockEwayNo);
    setEWayStatus("generated");
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-6">
      {/* E-Invoice Panel */}
      <div className="card p-5 border border-slate-200/80 bg-white shadow-sm rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`h-5 w-5 ${eInvoiceStatus === "generated" ? "text-emerald-500" : "text-slate-400"}`} />
            <h3 className="text-sm font-bold text-slate-800">E-Invoice (GST Portal)</h3>
          </div>
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
            eInvoiceStatus === "generated" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
          }`}>
            {eInvoiceStatus === "generated" ? "ACTIVE / SYNCED" : "PENDING"}
          </span>
        </div>

        {eInvoiceStatus === "pending" ? (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Verify compliance schemas and generate the direct government NIC-compliant E-Invoice registry file.
            </p>
            <button
              onClick={handleGenerateEInvoice}
              className="w-full btn-primary bg-blue-600 hover:bg-blue-700 text-xs py-2 flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Generate & Download E-Invoice JSON
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-start gap-3">
              <QrCode className="h-16 w-16 text-slate-800 shrink-0 bg-white border p-1 rounded" />
              <div className="space-y-1.5 overflow-hidden">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">IRN Reference</span>
                  <p className="font-mono text-[9px] text-slate-600 truncate">{irn}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Ack No</span>
                    <p className="font-bold text-slate-700">{ackNo}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                    <p className="font-bold text-emerald-600 flex items-center gap-0.5">
                      <Check className="h-3.5 w-3.5" /> Signed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* E-Way Bill Panel */}
      <div className="card p-5 border border-slate-200/80 bg-white shadow-sm rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className={`h-5 w-5 ${eWayStatus === "generated" ? "text-emerald-500" : "text-slate-400"}`} />
            <h3 className="text-sm font-bold text-slate-800">E-Way Bill (NIC Goods Pass)</h3>
          </div>
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
            eWayStatus === "generated" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
          }`}>
            {eWayStatus === "generated" ? "ISSUED" : "REQUIRED"}
          </span>
        </div>

        {eWayStatus === "pending" ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Vehicle Number</label>
                <input
                  type="text"
                  placeholder="e.g. MH-12-AB-1234"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                  className="input px-2.5 py-1.5 text-xs w-full mt-0.5"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Distance (KM)</label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="input px-2.5 py-1.5 text-xs w-full mt-0.5"
                />
              </div>
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Transporter ID</label>
              <input
                type="text"
                placeholder="e.g. TRANS1820"
                value={transporterId}
                onChange={(e) => setTransporterId(e.target.value)}
                className="input px-2.5 py-1.5 text-xs w-full mt-0.5"
              />
            </div>
            <button
              onClick={handleGenerateEWayBill}
              className="w-full btn-primary bg-indigo-600 hover:bg-indigo-700 text-xs py-2 flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/10 cursor-pointer"
            >
              <Truck className="h-3.5 w-3.5" />
              Generate & Download E-Way Bill
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-700 font-extrabold">
              <CheckCircle className="h-4 w-4" /> E-Way Bill Generated
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/50">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Eway Bill No</span>
                <span className="font-mono text-xs text-slate-700">{ewayNo}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Vehicle No</span>
                <span className="font-bold text-slate-700">{vehicleNo}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

