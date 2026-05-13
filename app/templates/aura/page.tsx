import React from 'react';
import Link from 'next/link';

export default function AuraTemplate() {
  const products = [
    { id: 1, name: 'Silk Midi Dress', price: '$245', category: 'Dresses', img: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1974&auto=format&fit=crop' },
    { id: 2, name: 'Linen Wide-Leg Pant', price: '$180', category: 'Bottoms', img: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1974&auto=format&fit=crop' },
    { id: 3, name: 'Cashmere V-Neck', price: '$320', category: 'Knitwear', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop' },
    { id: 4, name: 'Wool Tailored Coat', price: '$590', category: 'Outerwear', img: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1974&auto=format&fit=crop' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-sans selection:bg-[#BE185D] selection:text-white">
      {/* Banner */}
      <div className="bg-[#1A1A1A] text-white text-[11px] uppercase tracking-[0.2em] py-2 text-center font-medium">
        Free worldwide shipping on orders over $300
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8 hidden lg:flex text-xs uppercase tracking-[0.15em] font-medium">
            <a href="#" className="hover:text-[#BE185D] transition-colors">Shop</a>
            <a href="#" className="hover:text-[#BE185D] transition-colors">Collections</a>
            <a href="#" className="hover:text-[#BE185D] transition-colors">Editorial</a>
          </div>
          
          <div className="text-3xl font-serif italic tracking-tighter absolute left-1/2 -translate-x-1/2">
            Aura.
          </div>

          <div className="flex items-center gap-6 text-sm">
            <button className="hidden sm:block uppercase tracking-widest text-[11px] font-bold hover:text-[#BE185D] transition-colors">Search</button>
            <button className="uppercase tracking-widest text-[11px] font-bold hover:text-[#BE185D] transition-colors">Account</button>
            <button className="uppercase tracking-widest text-[11px] font-bold hover:text-[#BE185D] transition-colors flex items-center gap-2">
              Cart <span className="w-5 h-5 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center text-[9px]">0</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#E8E6E1]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-80 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 text-center text-white mix-blend-difference mt-20">
          <p className="text-sm uppercase tracking-[0.3em] mb-4">Spring / Summer 2026</p>
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter mb-8">The Art of <br/> Understatement</h1>
          <button className="border border-white px-10 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-black transition-all duration-300">
            Shop the Collection
          </button>
        </div>
      </section>

      {/* Curated Collection */}
      <section className="py-32 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-4xl font-serif italic tracking-tight mb-2">New Arrivals</h2>
            <p className="text-gray-500 uppercase tracking-widest text-xs">Curated for the modern muse</p>
          </div>
          <button className="border-b border-[#1A1A1A] pb-1 text-xs uppercase tracking-[0.2em] font-bold hover:text-[#BE185D] hover:border-[#BE185D] transition-all">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-[#F3F1EC] mb-6 relative overflow-hidden">
                <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                {/* Quick Add Button overlay */}
                <button className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-xs uppercase tracking-widest font-bold">
                  Quick Add
                </button>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">{product.category}</p>
                  <h3 className="text-lg font-medium group-hover:text-[#BE185D] transition-colors">{product.name}</h3>
                </div>
                <p className="font-serif text-lg">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Ethos */}
      <section className="py-24 bg-[#1A1A1A] text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-5xl font-serif italic tracking-tight mb-8 leading-tight">
            "Clothing should be a quiet extension of one's character, not a loud interruption."
          </h2>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Our Philosophy</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 px-6 lg:px-12 border-t border-black/10">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-2">
            <div className="text-4xl font-serif italic tracking-tighter mb-8">Aura.</div>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-8">
              Aura is dedicated to crafting timeless garments using ethically sourced materials and mindful production methods.
            </p>
            <div className="flex gap-4">
              <a href="#" className="uppercase tracking-widest text-[10px] font-bold hover:text-[#BE185D]">Instagram</a>
              <a href="#" className="uppercase tracking-widest text-[10px] font-bold hover:text-[#BE185D]">Pinterest</a>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6">Client Care</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black">Contact Us</a></li>
              <li><a href="#" className="hover:text-black">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-black">Size Guide</a></li>
              <li><a href="#" className="hover:text-black">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-6">Sign up to receive 10% off your first order.</p>
            <div className="flex border-b border-black pb-2">
              <input type="email" placeholder="Your Email Address" className="bg-transparent outline-none w-full text-sm placeholder:text-gray-400" />
              <button className="text-xs uppercase tracking-widest font-bold">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="text-center text-[10px] uppercase tracking-widest text-gray-400">
          © 2026 Aura Boutique. Designed with Arkle OS.
        </div>
      </footer>
    </div>
  );
}
