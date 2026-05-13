import React from 'react';
import Link from 'next/link';

export default function LuxeTemplate() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2d2d2d] font-serif selection:bg-[#d97706] selection:text-white">
      {/* Navigation */}
      <nav className="absolute w-full z-50 top-0 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between text-white">
          <div className="flex flex-col">
            <span className="text-3xl font-light tracking-widest uppercase">Luxe</span>
            <span className="text-[10px] tracking-[0.3em] text-white/70 uppercase">Properties</span>
          </div>
          <div className="hidden md:flex items-center gap-12 text-sm uppercase tracking-[0.2em] font-medium">
            <a href="#properties" className="hover:text-[#d97706] transition-colors">Estates</a>
            <a href="#about" className="hover:text-[#d97706] transition-colors">Our Vision</a>
            <a href="#journal" className="hover:text-[#d97706] transition-colors">Journal</a>
          </div>
          <button className="px-6 py-3 bg-white text-[#2d2d2d] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#d97706] hover:text-white transition-colors">
            Inquire
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image (Using a stylized color block since real images aren't available) */}
        <div className="absolute inset-0 bg-[#1a1a1a]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 z-10"></div>
          {/* Simulated Image with gradient */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')] bg-cover bg-center opacity-60"></div>
        </div>

        <div className="relative z-20 text-center text-white px-6">
          <p className="text-sm uppercase tracking-[0.4em] mb-6 text-[#d97706]">Exclusive Portfolio</p>
          <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-8 max-w-5xl leading-tight">
            Curating the world's most <span className="italic font-serif text-[#d97706]">extraordinary</span> homes.
          </h1>
          <button className="mt-8 pb-2 border-b border-white/50 hover:border-white text-sm uppercase tracking-[0.2em] transition-colors">
            Explore the Collection
          </button>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <p className="text-[#d97706] text-xs uppercase tracking-[0.3em] mb-4">Featured</p>
            <h2 className="text-4xl md:text-5xl font-light">Signature Estates</h2>
          </div>
          <button className="pb-1 border-b border-[#2d2d2d] text-xs uppercase tracking-[0.2em] hover:text-[#d97706] hover:border-[#d97706] transition-colors">
            View All Properties
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Property 1 */}
          <div className="group cursor-pointer">
            <div className="aspect-[4/5] bg-gray-200 overflow-hidden mb-8 relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-1000"></div>
              <div className="absolute top-6 right-6 bg-white px-4 py-2 text-xs uppercase tracking-widest font-bold">For Sale</div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl mb-2 font-light group-hover:text-[#d97706] transition-colors">The Beverly Hills Mansion</h3>
                <p className="text-gray-500 font-sans text-sm">Beverly Hills, California</p>
              </div>
              <p className="text-xl">$24,500,000</p>
            </div>
          </div>

          {/* Property 2 */}
          <div className="group cursor-pointer md:mt-32">
            <div className="aspect-[4/5] bg-gray-200 overflow-hidden mb-8 relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-1000"></div>
              <div className="absolute top-6 right-6 bg-[#2d2d2d] text-white px-4 py-2 text-xs uppercase tracking-widest font-bold">Sold</div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl mb-2 font-light group-hover:text-[#d97706] transition-colors">Modern Glass Villa</h3>
                <p className="text-gray-500 font-sans text-sm">Malibu, California</p>
              </div>
              <p className="text-xl">$18,200,000</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-24 px-8 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-light mb-8">Luxe Properties</h2>
            <p className="text-gray-400 font-sans max-w-sm leading-relaxed mb-8">Redefining luxury real estate with an unparalleled commitment to excellence and exclusivity.</p>
            <div className="flex gap-4">
              {['Ig', 'Fb', 'Tw'].map((social) => (
                <a key={social} href="#" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-sm hover:bg-white hover:text-black transition-colors">{social}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-8 text-gray-400">Company</h4>
            <ul className="space-y-4 font-sans text-sm">
              <li><a href="#" className="hover:text-[#d97706] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#d97706] transition-colors">Our Agents</a></li>
              <li><a href="#" className="hover:text-[#d97706] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#d97706] transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-8 text-gray-400">Newsletter</h4>
            <p className="font-sans text-sm text-gray-400 mb-4">Subscribe to receive exclusive listings and market insights.</p>
            <div className="flex border-b border-white/30 pb-2">
              <input type="email" placeholder="Email Address" className="bg-transparent outline-none font-sans text-sm w-full" />
              <button className="uppercase tracking-[0.2em] text-xs hover:text-[#d97706]">Join</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
