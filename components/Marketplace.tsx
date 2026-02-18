'use client';

import { useState } from 'react';
import { MarketplaceApp, IndustryType, BusinessSize } from '@/types/workspace';
import { MARKETPLACE_APPS, searchApps, getAppsByCategory } from '@/lib/marketplace-apps';

interface MarketplaceProps {
    industry?: IndustryType;
    businessSize?: BusinessSize;
    onInstallApp?: (appId: string) => void;
}

export default function Marketplace({ industry, businessSize, onInstallApp }: MarketplaceProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedApp, setSelectedApp] = useState<MarketplaceApp | null>(null);

    const categories = [
        { id: 'all', name: 'All Apps', icon: '📦' },
        { id: 'crm', name: 'CRM & Sales', icon: '🎯' },
        { id: 'erp', name: 'ERP & Operations', icon: '📊' },
        { id: 'communication', name: 'Communication', icon: '💬' },
        { id: 'payment', name: 'Payments', icon: '💳' },
        { id: 'marketing', name: 'Marketing', icon: '📢' },
        { id: 'finance', name: 'Finance', icon: '💰' },
        { id: 'productivity', name: 'Productivity', icon: '⚡' },
        { id: 'support', name: 'Support', icon: '🎧' },
        { id: 'inventory', name: 'Inventory', icon: '📦' },
        { id: 'analytics', name: 'Analytics', icon: '📈' }
    ];

    // Filter apps
    let filteredApps = searchQuery ? searchApps(searchQuery) : MARKETPLACE_APPS;

    if (selectedCategory !== 'all') {
        filteredApps = getAppsByCategory(selectedCategory);
    }

    // Sort by rating
    filteredApps.sort((a, b) => b.ratings.average - a.ratings.average);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-4">SetMyBizz Marketplace 🚀</h1>
                    <p className="text-xl text-white/90 mb-6">
                        Discover and install the best business tools - as easy as WordPress plugins
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search apps... (e.g., CRM, WhatsApp, invoicing)"
                                className="w-full px-6 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl">
                                🔍
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Categories */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 overflow-x-auto pb-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                                {cat.id === 'all' && (
                                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                        {MARKETPLACE_APPS.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'} found
                    </h2>
                </div>

                {/* Apps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApps.map((app) => (
                        <AppCard
                            key={app.id}
                            app={app}
                            onClick={() => setSelectedApp(app)}
                            onInstall={onInstallApp}
                        />
                    ))}
                </div>

                {filteredApps.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No apps found</h3>
                        <p className="text-gray-600">Try a different search term or category</p>
                    </div>
                )}
            </div>

            {/* App Detail Modal */}
            {selectedApp && (
                <AppDetailModal
                    app={selectedApp}
                    onClose={() => setSelectedApp(null)}
                    onInstall={onInstallApp}
                />
            )}
        </div>
    );
}

function AppCard({ app, onClick, onInstall }: any) {
    return (
        <div
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden border-2 border-transparent hover:border-indigo-200"
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="text-4xl">{app.icon}</div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{app.name}</h3>
                            <p className="text-sm text-gray-500">{app.category}</p>
                        </div>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star: number) => (
                            <span
                                key={star}
                                className={star <= Math.round(app.ratings.average) ? 'text-yellow-400' : 'text-gray-300'}
                            >
                                ⭐
                            </span>
                        ))}
                    </div>
                    <span className="text-sm text-gray-600">
                        {app.ratings.average} ({app.ratings.count})
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {app.description}
                </p>

                {/* Pricing */}
                <div className="mb-4">
                    {app.pricing.free ? (
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            <span>✓ Free tier available</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            <span>From ₹{app.pricing.tiers[0].price}/mo</span>
                        </div>
                    )}
                </div>

                {/* Features */}
                <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                        {app.features.slice(0, 3).map((feature: string, idx: number) => (
                            <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Install Count */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                        {app.installCount.toLocaleString()} installs
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        View Details →
                    </button>
                </div>
            </div>
        </div>
    );
}

function AppDetailModal({ app, onClose, onInstall }: any) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="text-5xl">{app.icon}</div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{app.name}</h2>
                            <p className="text-gray-600">{app.category}</p>
                            <div className="flex items-center space-x-2 mt-2">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star: number) => (
                                        <span
                                            key={star}
                                            className={star <= Math.round(app.ratings.average) ? 'text-yellow-400' : 'text-gray-300'}
                                        >
                                            ⭐
                                        </span>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {app.ratings.average} ({app.ratings.count} reviews)
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6">

                    {/* Description */}
                    <section className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">About</h3>
                        <p className="text-gray-700 leading-relaxed">{app.longDescription}</p>
                    </section>

                    {/* Features */}
                    <section className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Key Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {app.features.map((feature: string, idx: number) => (
                                <div key={idx} className="flex items-start space-x-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Pricing */}
                    <section className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Pricing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {app.pricing.tiers.map((tier: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="border-2 border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-all"
                                >
                                    <h4 className="font-bold text-lg text-gray-900 mb-2">{tier.name}</h4>
                                    <div className="text-3xl font-bold text-indigo-600 mb-3">
                                        {tier.price === 0 ? 'Free' : `₹${tier.price}`}
                                        {tier.price > 0 && <span className="text-sm text-gray-500">/mo</span>}
                                    </div>
                                    <ul className="space-y-2">
                                        {tier.features.map((feature: string, fidx: number) => (
                                            <li key={fidx} className="text-sm text-gray-700 flex items-start">
                                                <span className="text-green-500 mr-2">✓</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Integrations */}
                    {app.integrations.length > 0 && (
                        <section className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Integrations</h3>
                            <div className="flex flex-wrap gap-2">
                                {app.integrations.map((integration: string, idx: number) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                    >
                                        {integration}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Developer Info */}
                    <section className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Developer</h3>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="font-medium text-gray-900">{app.developer.name}</p>
                            {app.developer.website && (
                                <a
                                    href={app.developer.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-indigo-600 hover:text-indigo-700"
                                >
                                    Visit website →
                                </a>
                            )}
                        </div>
                    </section>

                    {/* Install Button */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-6 -mx-6 px-6 -mb-6 pb-6">
                        <button
                            onClick={() => {
                                if (onInstall) onInstall(app.id);
                                onClose();
                            }}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg py-4 rounded-xl hover:shadow-lg transition-all"
                        >
                            Install {app.name}
                        </button>
                        <p className="text-center text-sm text-gray-500 mt-3">
                            {app.installCount.toLocaleString()} businesses already use this
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
