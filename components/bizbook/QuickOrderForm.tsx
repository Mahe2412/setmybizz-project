'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Phone, User, MapPin, Trash2, Copy, QrCode, AlertCircle, MessageSquare } from 'lucide-react';

type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  tax: number;
  shipping: number;
};

type QuickOrderFormProps = {
  items: Array<{ id: string; name: string; sale_price: number }>;
  onOrderCreated?: (order: any) => void;
  darkMode?: boolean;
};

export const QuickOrderForm: React.FC<QuickOrderFormProps> = ({
  items = [],
  onOrderCreated,
  darkMode = false,
}) => {
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [channel, setChannel] = useState('whatsapp');
  const [paymentMethod, setPaymentMethod] = useState('phonepe');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate totals
  const { subtotal, gst, shipping, total } = useMemo(() => {
    let sub = 0;
    let tax = 0;
    let ship = 0;

    orderItems.forEach((item) => {
      sub += item.quantity * item.price;
      tax += item.tax;
      ship += item.shipping;
    });

    return {
      subtotal: sub,
      gst: tax,
      shipping: ship,
      total: sub + tax + ship,
    };
  }, [orderItems]);

  // Add item to order
  const addItem = useCallback(() => {
    if (!selectedProduct) return;
    const product = items.find((p) => p.id === selectedProduct);
    if (!product) return;

    const gstAmount = (product.sale_price * 18) / 100;
    const shippingAmount = 70;

    const newItem: OrderItem = {
      id: crypto.randomUUID(),
      productName: product.name,
      quantity,
      price: product.sale_price,
      tax: gstAmount * quantity,
      shipping: shippingAmount,
    };

    setOrderItems([...orderItems, newItem]);
    setSelectedProduct('');
    setQuantity(1);
  }, [selectedProduct, quantity, items]);

  // Remove item
  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  // Create order
  const createOrder = useCallback(() => {
    if (!phone || !customerName || !address || orderItems.length === 0) {
      alert('Please fill all required fields and add at least one product');
      return;
    }

    const order = {
      id: crypto.randomUUID(),
      phone,
      customerName,
      address,
      city,
      state,
      pincode,
      items: orderItems,
      subtotal,
      gst,
      shipping,
      total,
      channel,
      paymentMethod,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      paymentScreenshot: paymentScreenshot ? paymentScreenshot.name : null,
    };

    // Generate WhatsApp ready text
    const whatsappText = `Order Summary:
${orderItems.map((item) => `${item.productName} x${item.quantity} = ₹${item.price * item.quantity}`).join('\n')}

Amount: ₹${total.toFixed(2)}
Customer: ${customerName}
Phone: ${phone}
Address: ${address}, ${city}, ${state} ${pincode}`;

    console.log('Order Created:', order);
    console.log('WhatsApp Text:', whatsappText);

    onOrderCreated?.(order);
    setShowSuccess(true);

    // Reset form
    setTimeout(() => {
      setPhone('');
      setCustomerName('');
      setAddress('');
      setCity('');
      setState('');
      setPincode('');
      setOrderItems([]);
      setShowSuccess(false);
    }, 2000);
  }, [phone, customerName, address, city, state, pincode, orderItems, subtotal, gst, shipping, total, channel, paymentMethod, paymentScreenshot, onOrderCreated]);

  // Copy order details for delivery agent
  const copyForDelivery = useCallback(() => {
    const deliveryText = `🚚 DELIVERY INFO
Customer: ${customerName}
Phone: ${phone}
Address: ${address}
${city ? `City: ${city}` : ''}
${state ? `State: ${state}` : ''}
${pincode ? `Pincode: ${pincode}` : ''}

📦 PRODUCTS:
${orderItems.map((item) => `• ${item.productName} (Qty: ${item.quantity})`).join('\n')}

💰 TOTAL: ₹${total.toFixed(2)}
⏰ Status: Pending Delivery`;

    navigator.clipboard.writeText(deliveryText);
    alert('Delivery info copied to clipboard!');
  }, [customerName, phone, address, city, state, pincode, orderItems, total]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Customer & Order Details */}
        <div className="space-y-4">
          <h3 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            <Phone className="w-5 h-5" />
            Customer Details
          </h3>

          {/* Phone Number */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Phone Number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter customer phone"
              className={`w-full px-3 py-2 rounded border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>

          {/* Customer Name */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Customer Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer name"
              className={`w-full px-3 py-2 rounded border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>

          {/* Address */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Full Address *
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address"
              rows={3}
              className={`w-full px-3 py-2 rounded border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>

          {/* City, State, Pincode */}
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className={`px-3 py-2 rounded border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              className={`px-3 py-2 rounded border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Pincode"
              className={`px-3 py-2 rounded border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>

          {/* Channel Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Sales Channel
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['whatsapp', 'instagram', 'store', 'website'].map((ch) => (
                <button
                  key={ch}
                  onClick={() => setChannel(ch)}
                  className={`px-3 py-2 rounded font-medium transition ${
                    channel === ch
                      ? 'bg-indigo-600 text-white'
                      : darkMode
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {ch.charAt(0).toUpperCase() + ch.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Order Items */}
        <div className="space-y-4">
          <h3 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            <Plus className="w-5 h-5" />
            Add Products
          </h3>

          {/* Product Selector */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Product *
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className={`w-full px-3 py-2 rounded border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="">Select a product</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} - ₹{item.sale_price}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className={`w-full px-3 py-2 rounded border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>

          <button
            onClick={addItem}
            className="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition"
          >
            Add Product to Order
          </button>

          {/* Order Items List */}
          <div className={`rounded-lg p-3 space-y-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
            <p className={`font-semibold text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Order Items ({orderItems.length})
            </p>
            {orderItems.length === 0 ? (
              <p className={`text-sm italic ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No items added yet</p>
            ) : (
              orderItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex justify-between items-center p-2 rounded ${darkMode ? 'bg-slate-600' : 'bg-white'}`}
                >
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {item.productName}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.quantity} × ₹{item.price} = ₹{(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </div>

          {/* Payment Method */}
          {orderItems.length > 0 && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['phonepe', 'googlepay', 'paytm', 'cod'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`px-3 py-2 rounded font-medium transition text-sm ${
                      paymentMethod === method
                        ? 'bg-green-600 text-white'
                        : darkMode
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {method === 'cod' ? 'COD' : method.charAt(0).toUpperCase() + method.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Payment Screenshot */}
          {paymentMethod !== 'cod' && orderItems.length > 0 && (
            <div>
              <label className={`block text-sm font-medium mb-1 flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <AlertCircle className="w-4 h-4" />
                Payment Screenshot
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                className={`w-full px-3 py-2 rounded border ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {paymentScreenshot && (
                <p className="text-xs text-green-600 mt-1">✓ {paymentScreenshot.name}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      {orderItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-lg border-2 ${
            darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-300'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Subtotal</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                ₹{subtotal.toFixed(2)}
              </p>
            </div>
            <div>
              <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>GST (18%)</p>
              <p className={`text-lg font-bold text-amber-600`}>₹{gst.toFixed(2)}</p>
            </div>
            <div>
              <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Shipping</p>
              <p className={`text-lg font-bold text-blue-600`}>₹{shipping.toFixed(2)}</p>
            </div>
            <div>
              <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total</p>
              <p className={`text-lg font-bold text-green-600`}>₹{total.toFixed(2)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <button
              onClick={copyForDelivery}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
            >
              <Copy className="w-4 h-4" />
              Copy for Delivery
            </button>
            <button
              onClick={() => {
                const text = `Hi, Your order is ready! Total: ₹${total.toFixed(2)}. ${orderItems.map((i) => `${i.productName} (${i.quantity})`).join(', ')}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition"
            >
              <MessageSquare className="w-4 h-4" />
              Send on WhatsApp
            </button>
            <button
              onClick={createOrder}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition"
            >
              {showSuccess ? '✓ Order Created!' : 'Create Order'}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuickOrderForm;
