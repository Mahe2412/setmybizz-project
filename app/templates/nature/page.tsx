import React from 'react';
import Link from 'next/link';

export default function NatureTemplate() {
  const categories = [
    { name: 'Fresh Fruits', icon: '🍎', color: 'bg-red-50 text-red-600' },
    { name: 'Organic Veggies', icon: '🥬', color: 'bg-green-50 text-green-600' },
    { name: 'Dairy & Eggs', icon: '🥚', color: 'bg-orange-50 text-orange-600' },
    { name: 'Bakery', icon: '🥐', color: 'bg-amber-50 text-amber-600' },
    { name: 'Beverages', icon: '🧃', color: 'bg-blue-50 text-blue-600' },
    { name: 'Snacks', icon: '🥨', color: 'bg-purple-50 text-purple-600' }
  ];

  const products = [
    { id: 1, name: 'Organic Avocados', price: '$4.99', unit: 'per lb', badge: 'Best Seller', img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=1975&auto=format&fit=crop' },
    { id: 2, name: 'Farm Fresh Strawberries', price: '$5.50', unit: 'box', badge: 'Seasonal', img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, name: 'Sourdough Bread', price: '$6.00', unit: 'loaf', img: 'https://images.unsplash.com/photo-1585478259715-876a6a81fa08?q=80&w=2070&auto=format&fit=crop' },
    { id: 4, name: 'Almond Milk', price: '$3.99', unit: '1L', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=1965&auto=format&fit=crop' }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-green-500 selection:text-white">
      {/* Top Bar */}
      <div className="bg-green-700 text-white text-xs font-semibold py-2 px-6 flex justify-between items-center hidden md:flex">
        <div className="flex gap-4">
          <span><span className="opacity-70">Support:</span> +1 234 567 8900</span>
          <span><span className="opacity-70">Email:</span> hello@naturebasket.com</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-green-200 transition">Store Locator</a>
          <a href="#" className="hover:text-green-200 transition">Track Order</a>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-sm">🌿</div>
            <span className="text-2xl font-black tracking-tight text-green-900">Nature.</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:flex items-center">
            <div className="flex w-full border-2 border-green-100 rounded-full overflow-hidden focus-within:border-green-500 transition-colors bg-gray-50">
              <select className="bg-transparent border-none outline-none py-3 px-4 text-sm font-medium text-gray-600 border-r border-gray-200 cursor-pointer">
                <option>All Categories</option>
                <option>Groceries</option>
                <option>Fresh Produce</option>
              </select>
              <input type="text" placeholder="Search for organic products..." className="flex-1 bg-transparent border-none outline-none px-4 text-sm" />
              <button className="bg-green-600 text-white px-6 py-3 font-bold text-sm hover:bg-green-700 transition">
                Search
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="text-[10px] font-bold uppercase">Account</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-600 transition relative">
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">3</span>
              </div>
              <span className="text-[10px] font-bold uppercase">$24.50</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="px-6 py-6 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-green-50 overflow-hidden flex flex-col md:flex-row items-center">
          <div className="flex-1 p-10 lg:p-16">
            <span className="inline-block px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold uppercase tracking-wider mb-6">100% Organic</span>
            <h1 className="text-4xl lg:text-6xl font-black text-green-950 leading-tight mb-6">
              Fresh & Healthy <br/> <span className="text-green-600">Organic Food</span>
            </h1>
            <p className="text-gray-600 mb-8 max-w-md">Get fresh groceries delivered to your door step. Farm fresh, pesticides free, and carefully selected.</p>
            <button className="px-8 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 flex items-center gap-2">
              Shop Now <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
          <div className="flex-1 w-full h-64 md:h-auto min-h-[400px] relative">
             <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop" alt="Fresh vegetables" className="absolute inset-0 w-full h-full object-cover rounded-tl-3xl md:rounded-tl-none" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          Shop by Category <span className="text-sm font-medium text-green-600 ml-auto cursor-pointer hover:underline">View All</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <div key={i} className={`p-6 rounded-2xl ${cat.color} flex flex-col items-center justify-center cursor-pointer hover:-translate-y-1 transition-transform border border-transparent hover:border-black/5`}>
              <span className="text-4xl mb-3">{cat.icon}</span>
              <span className="font-bold text-sm text-center">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-12 px-6 max-w-7xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-green-500 hover:shadow-xl transition-all group relative">
              {product.badge && (
                <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {product.badge}
                </div>
              )}
              <div className="aspect-square bg-gray-50 relative overflow-hidden p-6">
                <img src={product.img} alt={product.name} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Groceries</p>
                <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{product.name}</h3>
                <div className="flex items-center gap-1 text-yellow-400 text-sm mb-4">
                  {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                  <span className="text-gray-400 text-xs ml-1">(24)</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-xl font-black text-green-600">{product.price}</span>
                    <span className="text-sm text-gray-400 font-medium ml-1">/{product.unit}</span>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <h3 className="text-2xl font-black mb-4">Nature Basket</h3>
        <p className="text-gray-400 text-sm">© 2026 Nature Basket. Powered by Arkle OS Lovable Engine.</p>
      </footer>
    </div>
  );
}
