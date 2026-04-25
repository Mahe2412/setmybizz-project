'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
   id: string;
   name: string;
   price: number;
   category: string;
   description: string;
   image: string;
   features: string[];
}

interface StoreState {
   cart: { product: Product; quantity: number }[];
   addToCart: (product: Product) => void;
   removeFromCart: (productId: string) => void;
   updateQuantity: (productId: string, qty: number) => void;
   clearCart: () => void;
   cartTotal: () => number;
}

export const useStore = create<StoreState>()(
   persist(
      (set, get) => ({
         cart: [],
         addToCart: (product) => set((state) => {
            const existing = state.cart.find(item => item.product.id === product.id);
            if (existing) {
               return {
                  cart: state.cart.map(item => 
                     item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                  )
               };
            }
            return { cart: [...state.cart, { product, quantity: 1 }] };
         }),
         removeFromCart: (productId) => set((state) => ({
            cart: state.cart.filter(item => item.product.id !== productId)
         })),
         updateQuantity: (productId, qty) => set((state) => ({
            cart: state.cart.map(item => 
               item.product.id === productId ? { ...item, quantity: Math.max(1, qty) } : item
            )
         })),
         clearCart: () => set({ cart: [] }),
         cartTotal: () => {
            return get().cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
         }
      }),
      { name: 'arkle-store-storage' }
   )
);

export const PRODUCTS: Product[] = [
   {
      id: 'neural-headset',
      name: 'Arkle Neural Headset',
      price: 24999,
      category: 'Audio',
      description: 'Experience pure spatial audio with neural noise cancellation. Designed for ultimate immersion.',
      image: '/store/headset.webp',
      features: ['Neural Noise Cancellation', '72-hour Battery', 'Spatial Audio Pro', 'Biometric Fit']
   },
   {
      id: 'quantum-tablet',
      name: 'Quantum Pro Tablet',
      price: 89999,
      category: 'Computing',
      description: 'The world\'s thinnest tablet with a 14-inch OLED neural display and M300 processor.',
      image: '/store/tablet.webp',
      features: ['OLED Neural Display', '6.0mm Ultra-thin', 'Multi-tasking Engine', '24GB RAM']
   },
   {
      id: 'nebula-watch',
      name: 'Nebula Smart Watch',
      price: 15999,
      category: 'Wearables',
      description: 'Your health and mission OS on your wrist. Advanced biometric tracking and GPS.',
      image: '/store/watch.webp',
      features: ['Biometric Health Sensor', 'Titanium Case', '5-Day Battery', 'Deep Sea Water Proof']
   },
   {
      id: 'titanium-phone',
      name: 'Titanium Edge Phone',
      price: 119999,
      category: 'Mobile',
      description: 'The pinnacle of mobile engineering. Aerospace-grade titanium with a 200MP neural camera.',
      image: '/store/phone.webp',
      features: ['Titanium Chassis', '200MP Neural Camera', '1TB Storage', '6.9" Pro Display']
   },
   {
      id: 'infinity-hub',
      name: 'Infinity Hub Station',
      price: 4999,
      category: 'Accessories',
      description: 'The ultimate connectivity hub. 12 ports in a sleek, glassmorphic aluminum design.',
      image: '/store/hub.webp',
      features: ['12-in-1 Connectivity', '100W Power Delivery', '8K Display Support', 'Compact Design']
   }
];
