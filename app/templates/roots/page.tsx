"use client";
import React from 'react';
import Link from 'next/link';

export default function RootsTemplate() {
  const products = [
    { id: 1, name: 'Sunni Pindi (Herbal Bath Powder)', price: '₹299', weight: '250g', img: '/bath_powder_brand_final_1776661313495.png', desc: 'Authentic blend of 12 natural herbs for glowing skin.' },
    { id: 2, name: 'Kunkudukai Herbal Shampoo', price: '₹349', weight: '200ml', img: '/shampoo_brand_final_1776661292629.png', desc: 'Traditional soapnut formulation for thick, dandruff-free hair.' },
    { id: 3, name: 'Pure Cold Pressed Castor Oil', price: '₹199', weight: '100ml', img: '/castor_oil_brand_final_1776662136201.png', desc: 'Hexane-free, premium grade oil for hair growth and skin.' },
    { id: 4, name: 'Wild Turmeric Powder (Kasturi)', price: '₹249', weight: '100g', img: '/turmeric_brand_final_1776662114656.png', desc: '100% natural Kasturi Manjal for clear, radiant face.' }
  ];

  return (
    <div className="min-h-screen bg-[#Fdfdf5] text-[#1a3a2a] font-serif selection:bg-[#4a7c59] selection:text-white pb-20">
      {/* Top Banner */}
      <div className="bg-[#1a3a2a] text-[#Fdfdf5] text-xs py-2 text-center font-sans tracking-widest uppercase">
        Use code ROOT10 for 10% off your first order • Free shipping over ₹999
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#Fdfdf5]/95 backdrop-blur-md border-b border-[#4a7c59]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-medium text-[#2d5a27]">
            <a href="#shop" className="hover:text-[#1a3a2a] transition-colors">Shop All</a>
            <a href="#about" className="hover:text-[#1a3a2a] transition-colors">Our Story</a>
          </div>
          
          <div className="flex-1 flex justify-center">
            <div className="text-3xl md:text-4xl font-black text-[#2d5a27] tracking-tighter flex items-center gap-2">
              <span className="material-symbols-outlined text-[32px]">spa</span>
              Roots & Leaves
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined text-[#2d5a27] cursor-pointer hover:scale-110 transition-transform">search</span>
            <span className="material-symbols-outlined text-[#2d5a27] cursor-pointer hover:scale-110 transition-transform">person</span>
            <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#2d5a27]">shopping_bag</span>
              <span className="absolute -top-1 -right-2 bg-[#d97706] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-[#e8f0e8] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-bold text-[#1a3a2a] leading-tight mb-6 font-serif">
              Return to your <br/><span className="text-[#4a7c59] italic">Natural Roots.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#2d5a27] mb-10 max-w-lg mx-auto md:mx-0 font-sans leading-relaxed">
              Experience the purest, 100% authentic Ayurvedic wellness products made directly from raw natural ingredients. No chemicals. Just nature.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="px-10 py-4 bg-[#2d5a27] text-white rounded-md font-sans uppercase tracking-widest text-sm font-bold hover:bg-[#1a3a2a] transition-colors shadow-xl shadow-[#2d5a27]/30">
                Explore Products
              </button>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-[#d97706]/20 blur-[100px] rounded-full"></div>
            {/* Using one of the generated artifact images if available, else a placeholder */}
            <div className="relative w-full aspect-square max-w-md mx-auto bg-white rounded-t-full rounded-b-[40px] shadow-2xl p-4 border border-[#4a7c59]/20 flex items-center justify-center overflow-hidden">
                <img src="/roots_leaves_hero_1776662191786.png" alt="Roots and Leaves Hero" className="w-full h-full object-cover rounded-t-full rounded-b-3xl" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1974&auto=format&fit=crop" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section id="shop" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#d97706] font-sans text-xs uppercase tracking-[0.3em] font-bold">Curated Selection</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">Our Best Sellers</h2>
          <div className="w-20 h-1 bg-[#4a7c59] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col bg-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-[#4a7c59]/10 hover:border-[#4a7c59]/40 transition-colors">
              <div className="aspect-[4/5] bg-[#f9f9f9] rounded-xl overflow-hidden mb-6 relative">
                <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=2053&auto=format&fit=crop" }} />
                <div className="absolute top-3 left-3 bg-[#fdfdf5] text-[#2d5a27] text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  {product.weight}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#1a3a2a] mb-2">{product.name}</h3>
              <p className="text-sm font-sans text-gray-500 mb-4 line-clamp-2">{product.desc}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-2xl font-bold text-[#4a7c59]">{product.price}</span>
                <button className="w-12 h-12 bg-[#fdfdf5] border border-[#2d5a27] text-[#2d5a27] rounded-full flex items-center justify-center hover:bg-[#2d5a27] hover:text-white transition-colors group-hover:shadow-lg">
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-[#1a3a2a] text-[#Fdfdf5] py-20 px-6 mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-5xl text-[#d97706] mb-4">eco</span>
            <h3 className="text-xl font-bold mb-2">100% Natural</h3>
            <p className="font-sans text-sm opacity-80">Sourced directly from organic farms. Zero chemicals or preservatives.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-5xl text-[#d97706] mb-4">handshake</span>
            <h3 className="text-xl font-bold mb-2">Ethically Made</h3>
            <p className="font-sans text-sm opacity-80">Handcrafted with love using traditional Ayurvedic methods.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-5xl text-[#d97706] mb-4">local_shipping</span>
            <h3 className="text-xl font-bold mb-2">Pan India Delivery</h3>
            <p className="font-sans text-sm opacity-80">Fast and secure shipping across India within 3-5 business days.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
