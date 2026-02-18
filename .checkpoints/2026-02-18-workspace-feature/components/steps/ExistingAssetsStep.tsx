import React from 'react';
import { BusinessData, ExistingAsset } from '../../types'; // Modified to import ExistingAsset type which might be missing in types/index.ts. I will add it.

interface ExistingAssetsStepProps {
    data: BusinessData;
    updateData: (newData: Partial<BusinessData>) => void;
    onNext: () => void;
    onBack: () => void;
    uiStep: number;
}

const ExistingAssetsStep: React.FC<ExistingAssetsStepProps> = ({ data, updateData, onNext, onBack, uiStep }) => {
    const options: { id: ExistingAsset; label: string; icon: string; color: string }[] = [
        { id: 'business_cards', label: 'Business cards', icon: 'badge', color: 'blue' },
        { id: 'domain', label: 'Domain name', icon: 'language', color: 'purple' },
        { id: 'mailbox', label: 'Business mailbox', icon: 'mail', color: 'red' },
        { id: 'logo', label: 'Logo design', icon: 'brush', color: 'orange' },
        { id: 'trademark', label: 'Trademark (TM)', icon: 'verified', color: 'indigo' },
        { id: 'gst', label: 'GST / EIN Number', icon: 'receipt_long', color: 'teal' },
        { id: 'llc', label: 'LLC / Private Ltd', icon: 'gavel', color: 'slate' },
        { id: 'name', label: 'Business Name', icon: 'storefront', color: 'pink' },
        { id: 'website', label: 'Website', icon: 'web', color: 'cyan' },
        { id: 'ecommerce', label: 'E-commerce Store', icon: 'shopping_cart', color: 'emerald' },
        { id: 'startup_india', label: 'Startup India Reg.', icon: 'rocket_launch', color: 'yellow' },
        { id: 'udyam', label: 'Udyam Registration', icon: 'factory', color: 'rose' },
    ];

    const toggleAsset = (id: ExistingAsset) => {
        // Ensure existingAssets is initialized
        const currentAssets = data.existingAssets || [];
        const next = currentAssets.includes(id)
            ? currentAssets.filter(x => x !== id)
            : [...currentAssets, id];
        updateData({ existingAssets: next });
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-10 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
                    Does your business already have any of the following?
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                    This will help us tailor your personal plan and skip steps you've already completed.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mx-auto">
                {options.map(opt => (
                    <label
                        key={opt.id}
                        className={`group relative flex items-center p-4 cursor-pointer bg-card-light dark:bg-card-dark border rounded-xl shadow-sm transition-all duration-200 ${data.existingAssets?.includes(opt.id) ? 'border-primary ring-1 ring-primary/20 bg-blue-50/20' : 'border-slate-200 dark:border-slate-800 hover:border-primary'}`}
                    >
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={data.existingAssets?.includes(opt.id) || false}
                            onChange={() => toggleAsset(opt.id)}
                        />
                        <div className={`p-3 rounded-lg text-white bg-slate-100 dark:bg-slate-800 transition-colors ${data.existingAssets?.includes(opt.id) ? 'bg-primary' : 'group-hover:bg-slate-200'}`}>
                            <span className={`material-icons-outlined text-2xl transition-colors ${data.existingAssets?.includes(opt.id) ? 'text-white' : 'text-slate-400'}`}>
                                {opt.icon}
                            </span>
                        </div>
                        <div className="ml-4 flex-grow">
                            <span className={`font-medium transition-colors ${data.existingAssets?.includes(opt.id) ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                                {opt.label}
                            </span>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${data.existingAssets?.includes(opt.id) ? 'bg-primary border-primary scale-110' : 'border-slate-300 dark:border-slate-600'}`}>
                            {data.existingAssets?.includes(opt.id) && <span className="material-icons-round text-white text-[10px]">check</span>}
                        </div>
                    </label>
                ))}
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={() => updateData({ existingAssets: [] })}
                    className="text-sm text-slate-500 hover:text-primary underline"
                >
                    None of the above
                </button>
            </div>

            <footer className="w-full mt-12 py-8 px-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6">
                <button
                    onClick={onBack}
                    className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                >
                    <span className="material-icons-outlined">chevron_left</span> Back
                </button>
                <div className="flex flex-col items-center">
                    <span className="material-icons-round text-secondary text-4xl mb-1">verified_user</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-widest">SetMyBizz.in</span>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onNext}
                        className="px-6 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 font-medium transition-colors"
                    >
                        Skip
                    </button>
                    <button
                        onClick={onNext}
                        className="px-8 py-2.5 rounded-full bg-primary text-white font-medium shadow-lg hover:bg-blue-700 transition-all"
                    >
                        Continue
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ExistingAssetsStep;
