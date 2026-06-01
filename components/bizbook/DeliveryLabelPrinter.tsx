'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Printer, Download, Copy, CheckCircle2, Package, Truck, MapPin, Phone, User } from 'lucide-react';

type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{ productName: string; quantity: number }>;
  total: number;
  status: string;
  createdAt: string;
};

type DeliveryLabelPrinterProps = {
  orders?: Order[];
  darkMode?: boolean;
};

export const DeliveryLabelPrinter: React.FC<DeliveryLabelPrinterProps> = ({
  orders = [],
  darkMode = false,
}) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [printMode, setPrintMode] = useState<'single' | 'batch'>('single');

  const toggleOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const generateQRCode = (text: string): string => {
    // Simple QR code generation (in production, use a library like qrcode.react)
    return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(text)}`;
  };

  const printLabel = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const qrUrl = generateQRCode(order.id);
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Delivery Label - ${order.customerName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          padding: 10px;
        }
        .label {
          width: 4in;
          height: 6in;
          border: 2px solid #000;
          padding: 15px;
          page-break-after: always;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: white;
          color: black;
        }
        .header {
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
          margin-bottom: 10px;
          text-align: center;
          font-weight: bold;
          font-size: 14px;
        }
        .qr-code {
          text-align: center;
          margin-bottom: 10px;
        }
        .qr-code img {
          width: 80px;
          height: 80px;
        }
        .customer-info {
          margin-bottom: 10px;
          font-size: 12px;
          line-height: 1.4;
        }
        .customer-name {
          font-weight: bold;
          font-size: 13px;
          margin-bottom: 3px;
        }
        .phone {
          margin-bottom: 3px;
        }
        .address {
          margin-bottom: 3px;
        }
        .products {
          border-top: 1px solid #ccc;
          padding-top: 8px;
          margin-top: 8px;
          font-size: 11px;
          line-height: 1.3;
        }
        .product-item {
          margin-bottom: 3px;
        }
        .footer {
          border-top: 1px solid #ccc;
          padding-top: 8px;
          margin-top: 8px;
          text-align: center;
          font-weight: bold;
          font-size: 13px;
          color: #d97706;
        }
        .status {
          text-align: center;
          margin-top: 5px;
          font-size: 10px;
          color: #666;
        }
        @media print {
          body { margin: 0; padding: 0; }
          .label { margin-bottom: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="label">
        <div class="header">📦 DELIVERY LABEL</div>
        
        <div class="qr-code">
          <img src="${qrUrl}" alt="Order ID: ${order.id}" />
        </div>
        
        <div class="customer-info">
          <div class="customer-name">👤 ${order.customerName}</div>
          <div class="phone">📱 ${order.phone}</div>
          <div class="address">📍 ${order.address}<br/>${order.city}, ${order.state} ${order.pincode}</div>
        </div>
        
        <div class="products">
          <strong>📦 Order Items:</strong><br/>
          ${order.items
            .map(
              (item) =>
                `<div class="product-item">• ${item.productName} (Qty: ${item.quantity})</div>`
            )
            .join('')}
        </div>
        
        <div class="footer">
          💰 ₹${order.total.toFixed(2)}
        </div>
        
        <div class="status">
          Order ID: ${order.id.slice(0, 8)}...
        </div>
      </div>
    </body>
    </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const copyAllForDeliveryAgents = () => {
    const selectedOrdersList = orders.filter((order) => selectedOrders.includes(order.id));

    const deliveryText = selectedOrdersList
      .map(
        (order) =>
          `📦 ORDER: ${order.id.slice(0, 8)}
👤 ${order.customerName}
📱 ${order.phone}
📍 ${order.address}, ${order.city}, ${order.state} ${order.pincode}
Items: ${order.items.map((i) => `${i.productName} (${i.quantity})`).join(', ')}
💰 Total: ₹${order.total.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━`
      )
      .join('\n\n');

    navigator.clipboard.writeText(deliveryText);
    alert(`Copied ${selectedOrdersList.length} order(s) for delivery agents!`);
  };

  const printSelectedBatch = () => {
    const selectedOrdersList = orders.filter((order) => selectedOrders.includes(order.id));
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Batch Delivery Labels</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          padding: 10px;
        }
        .label {
          width: 4in;
          height: 6in;
          border: 2px solid #000;
          padding: 15px;
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: white;
          color: black;
          page-break-after: always;
        }
        .header {
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
          margin-bottom: 10px;
          text-align: center;
          font-weight: bold;
          font-size: 14px;
        }
        .qr-code {
          text-align: center;
          margin-bottom: 10px;
        }
        .qr-code img {
          width: 80px;
          height: 80px;
        }
        .customer-info {
          margin-bottom: 10px;
          font-size: 12px;
          line-height: 1.4;
        }
        .customer-name {
          font-weight: bold;
          font-size: 13px;
          margin-bottom: 3px;
        }
        .phone { margin-bottom: 3px; }
        .address { margin-bottom: 3px; }
        .products {
          border-top: 1px solid #ccc;
          padding-top: 8px;
          margin-top: 8px;
          font-size: 11px;
          line-height: 1.3;
        }
        .product-item { margin-bottom: 3px; }
        .footer {
          border-top: 1px solid #ccc;
          padding-top: 8px;
          margin-top: 8px;
          text-align: center;
          font-weight: bold;
          font-size: 13px;
          color: #d97706;
        }
        .status {
          text-align: center;
          margin-top: 5px;
          font-size: 10px;
          color: #666;
        }
        @media print {
          body { margin: 0; padding: 0; }
          .label { margin-bottom: 20px; }
        }
      </style>
    </head>
    <body>
    `;

    selectedOrdersList.forEach((order) => {
      const qrUrl = generateQRCode(order.id);
      htmlContent += `
      <div class="label">
        <div class="header">📦 DELIVERY LABEL</div>
        <div class="qr-code">
          <img src="${qrUrl}" alt="Order ID: ${order.id}" />
        </div>
        <div class="customer-info">
          <div class="customer-name">👤 ${order.customerName}</div>
          <div class="phone">📱 ${order.phone}</div>
          <div class="address">📍 ${order.address}<br/>${order.city}, ${order.state} ${order.pincode}</div>
        </div>
        <div class="products">
          <strong>📦 Order Items:</strong><br/>
          ${order.items.map((item) => `<div class="product-item">• ${item.productName} (Qty: ${item.quantity})</div>`).join('')}
        </div>
        <div class="footer">
          💰 ₹${order.total.toFixed(2)}
        </div>
        <div class="status">
          Order ID: ${order.id.slice(0, 8)}...
        </div>
      </div>
      `;
    });

    htmlContent += `</body></html>`;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          <Truck className="w-5 h-5" />
          Delivery Labels & Shipping
        </h3>
        <div className="flex items-center gap-2">
          <label className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Mode:</label>
          <select
            value={printMode}
            onChange={(e) => setPrintMode(e.target.value as 'single' | 'batch')}
            className={`px-3 py-1 rounded border text-sm ${
              darkMode
                ? 'bg-slate-700 border-slate-600 text-white'
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="single">Single Label</option>
            <option value="batch">Batch Print</option>
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className={`p-8 rounded-lg text-center ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
          <Package className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <p className={`font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>No orders yet</p>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Create orders to generate delivery labels
          </p>
        </div>
      ) : (
        <>
          {/* Orders List */}
          <div className="space-y-3 mb-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  selectedOrders.includes(order.id)
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                    : darkMode
                      ? 'border-slate-700 bg-slate-700/50'
                      : 'border-slate-200 bg-slate-50'
                }`}
                onClick={() => printMode === 'batch' && toggleOrder(order.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {printMode === 'batch' && (
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrder(order.id)}
                        className="mr-3"
                      />
                    )}
                    <div className="inline-block">
                      <p className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {order.customerName}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <span>📱 {order.phone}</span>
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <span>📍 {order.city}, {order.state}</span>
                      </p>
                      <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        💰 ₹{order.total.toFixed(2)}
                      </p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                        {order.items.map((item) => `${item.productName} (${item.quantity})`).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => printLabel(order)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition whitespace-nowrap"
                    >
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                    <button
                      onClick={() => {
                        const text = `Order: ${order.id.slice(0, 8)}
${order.customerName}
${order.phone}
${order.address}
${order.city}, ${order.state} ${order.pincode}
Total: ₹${order.total.toFixed(2)}`;
                        navigator.clipboard.writeText(text);
                        alert('Order details copied!');
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition whitespace-nowrap"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Batch Actions */}
          {printMode === 'batch' && selectedOrders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg"
            >
              <button
                onClick={printSelectedBatch}
                className="flex items-center gap-2 flex-1 px-4 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition"
              >
                <Printer className="w-5 h-5" />
                Print {selectedOrders.length} Labels
              </button>
              <button
                onClick={copyAllForDeliveryAgents}
                className="flex items-center gap-2 flex-1 px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition"
              >
                <Copy className="w-5 h-5" />
                Copy for Agents
              </button>
              <button
                onClick={() => setSelectedOrders([])}
                className="flex items-center gap-2 px-4 py-2 bg-slate-400 text-white rounded font-medium hover:bg-slate-500 transition"
              >
                Clear
              </button>
            </motion.div>
          )}
        </>
      )}

      {/* Instructions */}
      <div className={`mt-6 p-4 rounded-lg border-l-4 ${
        darkMode
          ? 'bg-slate-700 border-blue-500 text-slate-300'
          : 'bg-blue-50 border-blue-500 text-slate-700'
      }`}>
        <p className="font-bold mb-2">📋 How to use:</p>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li><strong>Single Mode:</strong> Print one label at a time directly to your printer</li>
          <li><strong>Batch Mode:</strong> Select multiple orders and print all labels together</li>
          <li><strong>Copy:</strong> Copy order details to share with delivery agents via WhatsApp</li>
          <li><strong>Label Format:</strong> Optimized for 4x6 thermal printer labels</li>
          <li><strong>QR Code:</strong> Each label includes QR for tracking</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default DeliveryLabelPrinter;
