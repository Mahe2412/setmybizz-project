import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { amountInWords, INDIAN_STATES } from "@billease/shared";

type InvoiceData = {
  business: {
    name: string;
    legalName?: string | null;
    gstin?: string | null;
    address?: string | null;
    city?: string | null;
    pincode?: string | null;
    phone?: string | null;
    email?: string | null;
    stateCode: string;
    bankName?: string | null;
    bankAccount?: string | null;
    bankIfsc?: string | null;
    bankBranch?: string | null;
    upiId?: string | null;
    signatory?: string | null;
    termsAndConditions?: string | null;
  };
  document: {
    number?: string | null;
    type: string;
    date: string;
    dueDate?: string | null;
    placeOfSupply?: string | null;
    cgstTotal: number;
    sgstTotal: number;
    igstTotal: number;
    grandTotal: number;
    roundOff: number;
    taxableTotal: number;
    notes?: string | null;
  };
  party?: {
    name: string;
    gstin?: string | null;
    phone?: string | null;
    billingAddress?: string | null;
    stateCode: string;
  } | null;
  lines: Array<{
    description: string;
    hsnSac?: string | null;
    qty: number;
    unit: string;
    rate: number;
    discountPct: number;
    gstRate: number;
    taxableValue: number;
    cgst: number;
    sgst: number;
    igst: number;
    lineTotal: number;
  }>;
};

export function InvoicePdf({ data, theme = "classic" }: { data: InvoiceData; theme?: string }) {
  const docTypeLabels: Record<string, string> = {
    quotation: "QUOTATION",
    purchase: "PURCHASE BILL",
    credit_note: "CREDIT NOTE",
    proforma: "PRO FORMA INVOICE",
    challan: "DELIVERY CHALLAN",
    purchase_order: "PURCHASE ORDER",
  };
  const docType = docTypeLabels[data.document.type] ?? "TAX INVOICE";

  const pos = data.document.placeOfSupply ?? data.business.stateCode;
  const hasBankDetails = data.business.bankName || data.business.bankAccount;
  const isIgst = data.document.igstTotal > 0;

  // Premium Theme Presets
  let accentColor = "#2563eb";
  let headerBg = "#f1f5f9";
  let titleColor = "#0f172a";
  let showHeaderBar = false;

  if (theme === "emerald") {
    accentColor = "#059669";
    headerBg = "#ecfdf5";
    titleColor = "#064e3b";
    showHeaderBar = true;
  } else if (theme === "sapphire") {
    accentColor = "#1d4ed8";
    headerBg = "#eff6ff";
    titleColor = "#1e3a8a";
    showHeaderBar = true;
  }

  const styles = StyleSheet.create({
    page: { padding: 36, fontSize: 9, fontFamily: "Helvetica", color: "#334155" },
    headerBar: { height: 6, backgroundColor: accentColor, marginBottom: 16, borderRadius: 2 },
    header: { marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid #e2e8f0` },
    bizName: { fontSize: 18, fontWeight: "bold", color: titleColor, marginBottom: 2 },
    bizSub: { fontSize: 8, color: "#64748b", marginTop: 1 },
    docTypeRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
    docTypeBlock: { backgroundColor: accentColor, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
    docTypeText: { color: "#ffffff", fontSize: 11, fontWeight: "bold" },
    docInfo: { fontSize: 8.5, color: "#475569", marginTop: 2 },
    billToBox: { border: `1px solid #e2e8f0`, borderRadius: 4, padding: 8, maxWidth: 220 },
    billToLabel: { fontSize: 7, fontWeight: "bold", color: accentColor, marginBottom: 3, textTransform: "uppercase" },
    billToName: { fontSize: 10, fontWeight: "bold", color: "#0f172a", marginBottom: 1 },
    table: { marginTop: 12, border: `1px solid #e2e8f0`, borderRadius: 4 },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: headerBg,
      paddingHorizontal: 8,
      paddingVertical: 7,
      borderBottom: `1px solid ${accentColor}`,
    },
    th: { fontSize: 7.5, fontWeight: "bold", color: theme !== "classic" ? accentColor : "#475569", textTransform: "uppercase" },
    tableRow: { flexDirection: "row", paddingHorizontal: 8, paddingVertical: 6, borderBottom: "1px solid #f1f5f9", alignItems: "center" },
    col1: { width: "32%", fontSize: 8.5 },
    col2: { width: "9%", textAlign: "right", fontSize: 8 },
    col3: { width: "9%", textAlign: "right", fontSize: 8 },
    col4: { width: "12%", textAlign: "right", fontSize: 8 },
    col5: { width: "10%", textAlign: "right", fontSize: 8 },
    col6: { width: "12%", textAlign: "right", fontSize: 8 },
    col7: { width: "8%", textAlign: "right", fontSize: 8 },
    col8: { width: "8%", textAlign: "right", fontSize: 8 },
    bottomSection: { flexDirection: "row", marginTop: 16, gap: 12 },
    bankBox: { flex: 1, border: `1px solid #e2e8f0`, borderRadius: 4, padding: 8 },
    bankLabel: { fontSize: 7, fontWeight: "bold", color: accentColor, marginBottom: 4, textTransform: "uppercase" },
    bankRow: { fontSize: 8, color: "#475569", marginBottom: 2 },
    totalsBox: { width: 220 },
    totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5, paddingHorizontal: 8 },
    grandRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: accentColor,
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 4,
      marginTop: 6,
    },
    grandText: { color: "#ffffff", fontWeight: "bold", fontSize: 10 },
    signatoryBox: { flexDirection: "row", justifyContent: "space-between", marginTop: 24, paddingTop: 12, borderTop: "1px dashed #e2e8f0" },
    signatoryLine: { borderTop: "1px solid #cbd5e1", width: 130, paddingTop: 4, marginTop: 20 },
    signatoryLabel: { fontSize: 7.5, color: "#94a3b8", textAlign: "center" },
    footer: { marginTop: 12, fontSize: 7.5, color: "#94a3b8", textAlign: "center" },
    termsBox: { marginTop: 10, padding: 8, backgroundColor: "#f8fafc", borderRadius: 4, border: "1px solid #e2e8f0" },
    termsLabel: { fontSize: 7, fontWeight: "bold", color: "#64748b", marginBottom: 3, textTransform: "uppercase" },
    termsText: { fontSize: 7.5, color: "#64748b", lineHeight: 1.5 },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top accent bar */}
        {showHeaderBar && <View style={styles.headerBar} />}

        {/* Business Header */}
        <View style={styles.header}>
          <Text style={styles.bizName}>{data.business.name}</Text>
          {data.business.legalName && <Text style={styles.bizSub}>{data.business.legalName}</Text>}
          {data.business.gstin && <Text style={styles.bizSub}>GSTIN: {data.business.gstin}</Text>}
          <Text style={styles.bizSub}>
            {[data.business.address, data.business.city, data.business.pincode].filter(Boolean).join(", ")}
          </Text>
          {data.business.phone && <Text style={styles.bizSub}>Ph: {data.business.phone}{data.business.email ? `  |  ${data.business.email}` : ""}</Text>}
        </View>

        {/* Document Type Row */}
        <View style={styles.docTypeRow}>
          <View>
            <View style={styles.docTypeBlock}>
              <Text style={styles.docTypeText}>{docType}</Text>
            </View>
            <Text style={styles.docInfo}>No: {data.document.number ?? "DRAFT"}</Text>
            <Text style={styles.docInfo}>Date: {data.document.date}</Text>
            {data.document.dueDate && <Text style={styles.docInfo}>Due: {data.document.dueDate}</Text>}
            <Text style={styles.docInfo}>Place of Supply: {INDIAN_STATES[pos] ?? pos} ({pos})</Text>
          </View>
          {data.party && (
            <View style={styles.billToBox}>
              <Text style={styles.billToLabel}>Bill To</Text>
              <Text style={styles.billToName}>{data.party.name}</Text>
              {data.party.gstin && <Text style={styles.docInfo}>GSTIN: {data.party.gstin}</Text>}
              {data.party.phone && <Text style={styles.docInfo}>Ph: {data.party.phone}</Text>}
              {data.party.billingAddress && <Text style={styles.docInfo}>{data.party.billingAddress}</Text>}
            </View>
          )}
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.col1]}>Item</Text>
            <Text style={[styles.th, styles.col2]}>HSN</Text>
            <Text style={[styles.th, styles.col3]}>Qty</Text>
            <Text style={[styles.th, styles.col4]}>Rate</Text>
            <Text style={[styles.th, styles.col5]}>Disc%</Text>
            <Text style={[styles.th, styles.col6]}>Taxable</Text>
            <Text style={[styles.th, styles.col7]}>GST%</Text>
            <Text style={[styles.th, styles.col8]}>Total</Text>
          </View>
          {data.lines.map((line, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.col1}>{line.description}</Text>
              <Text style={styles.col2}>{line.hsnSac ?? "-"}</Text>
              <Text style={styles.col3}>{line.qty} {line.unit}</Text>
              <Text style={styles.col4}>{line.rate.toFixed(2)}</Text>
              <Text style={styles.col5}>{line.discountPct > 0 ? `${line.discountPct}%` : "-"}</Text>
              <Text style={styles.col6}>{line.taxableValue.toFixed(2)}</Text>
              <Text style={styles.col7}>{line.gstRate}%</Text>
              <Text style={styles.col8}>{line.lineTotal.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Bottom: Bank + Totals */}
        <View style={styles.bottomSection}>
          {/* Bank Details */}
          <View style={styles.bankBox}>
            {hasBankDetails && (
              <>
                <Text style={styles.bankLabel}>Bank Details</Text>
                {data.business.bankName && <Text style={styles.bankRow}>Bank: {data.business.bankName}</Text>}
                {data.business.bankAccount && <Text style={styles.bankRow}>A/C: {data.business.bankAccount}</Text>}
                {data.business.bankIfsc && <Text style={styles.bankRow}>IFSC: {data.business.bankIfsc}</Text>}
                {data.business.bankBranch && <Text style={styles.bankRow}>Branch: {data.business.bankBranch}</Text>}
                {data.business.upiId && <Text style={styles.bankRow}>UPI: {data.business.upiId}</Text>}
              </>
            )}
            {data.document.notes && (
              <>
                <Text style={[styles.bankLabel, { marginTop: hasBankDetails ? 8 : 0 }]}>Notes</Text>
                <Text style={styles.bankRow}>{data.document.notes}</Text>
              </>
            )}
            <Text style={[styles.bankRow, { marginTop: 8, fontStyle: "italic" }]}>
              Amount in words: {amountInWords(data.document.grandTotal)}
            </Text>
          </View>

          {/* Totals */}
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={{ fontSize: 8, color: "#475569" }}>Taxable Amount</Text>
              <Text style={{ fontSize: 8 }}>₹ {data.document.taxableTotal.toFixed(2)}</Text>
            </View>
            {data.document.cgstTotal > 0 && (
              <View style={styles.totalRow}>
                <Text style={{ fontSize: 8, color: "#475569" }}>CGST</Text>
                <Text style={{ fontSize: 8 }}>₹ {data.document.cgstTotal.toFixed(2)}</Text>
              </View>
            )}
            {data.document.sgstTotal > 0 && (
              <View style={styles.totalRow}>
                <Text style={{ fontSize: 8, color: "#475569" }}>SGST</Text>
                <Text style={{ fontSize: 8 }}>₹ {data.document.sgstTotal.toFixed(2)}</Text>
              </View>
            )}
            {data.document.igstTotal > 0 && (
              <View style={styles.totalRow}>
                <Text style={{ fontSize: 8, color: "#475569" }}>IGST</Text>
                <Text style={{ fontSize: 8 }}>₹ {data.document.igstTotal.toFixed(2)}</Text>
              </View>
            )}
            {data.document.roundOff !== 0 && (
              <View style={styles.totalRow}>
                <Text style={{ fontSize: 8, color: "#475569" }}>Round Off</Text>
                <Text style={{ fontSize: 8 }}>₹ {data.document.roundOff.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.grandRow}>
              <Text style={styles.grandText}>Grand Total</Text>
              <Text style={styles.grandText}>₹ {data.document.grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Terms */}
        {data.business.termsAndConditions && (
          <View style={styles.termsBox}>
            <Text style={styles.termsLabel}>Terms & Conditions</Text>
            <Text style={styles.termsText}>{data.business.termsAndConditions}</Text>
          </View>
        )}

        {/* Signatory */}
        <View style={styles.signatoryBox}>
          <View />
          <View>
            <View style={styles.signatoryLine} />
            <Text style={styles.signatoryLabel}>
              {data.business.signatory ? `${data.business.signatory}` : data.business.name}
            </Text>
            <Text style={styles.signatoryLabel}>Authorized Signatory</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Generated by Bill Book — This is a computer-generated document and does not require a physical signature.
        </Text>
      </Page>
    </Document>
  );
}

