import React from 'react';
import { BusinessData } from '../../types';

interface MotivationStepProps {
    data: BusinessData;
    updateData: (newData: Partial<BusinessData>) => void;
    onNext: () => void;
    onBack: () => void;
    uiStep: number;
    totalSteps: number;
}

const MotivationStep: React.FC<MotivationStepProps> = ({ data, updateData, onNext, onBack, uiStep, totalSteps }) => {
    const options = [
        {
            id: 'Being my own boss',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW7EBHR7LcB_69qvHxAbll7AzGwS7oUUCU1xrD9jlcicZJCvaDeBjblgVLKWON9Ejney8U3kl_i9XdPLjWTwmbDzADUPOcznMhey0vJ9M4xb2WlMij0v4H9bVJ1XYgI9pKPN3HkWVhh3-h5B5_whR3FjNamoHo72ToTOdlv8XYuOalwmczPqliiAw8FuDm71KhSHphjIzfkIMRe1qO_H0mHUGZricx4PbqSAZEst7xQo5MFePEHm70JT2-ZFfsdG8IDQ2PP1eJ26nj'
        },
        {
            id: 'Making extra money',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAokMfG10MPDEtDr1YPKqKLakw11LiAlpZoABmdopyBprdLkBbd_EA6xyooYgTSU7JcOf5mY3-dyMkhyxhB6Ic5ho5ZMgx-FjNQ5Aa1HgBJ5JFWNIcmr-al-9su8xKq6Ed9TeBX_hUKGOdD7brKjeKm8O75MWCisSw8IVb_xJU41j0xRryGGSWdswf4A17hKhDTAV2Z4q-1urg13FuBTIIjQer8YtNV1qe4MIssJTAP0CJBQXgYcWzV-Sps-7q-nK_OB0zbhcC43bn6'
        },
        {
            id: 'Doing what I love',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIr2Sh1BTjsXXexATmyctJJyp0qNE2OuYxi-WLPRl6HYd63yL9tBBI_-96bJ6L5-DOzZrDW-Nq76svL_m-2AkNvqNKK3JIPaJexO_kt9qn9mVD98wPSzP0pKvKU7-V9M6E8pBcoHA-HhjAl_6kdCk2ElLcoQSGm9imG8sC2bmQwUMBSxsC1TtdztSrUQEROpErNzIB4faMja3Z-ij4WQf6ag6wQrnOXwZ_V2i-w8kwXk6uihl2_8-uL-fKfWUbk4O4irhjgzn8wFPG'
        },
    ];

    return (
        <div className="w-full max-w-5xl mx-auto px-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8 space-y-3">
                <span className="text-[10px] font-black text-slate-500 bg-white px-5 py-2 rounded-full shadow-sm inline-block uppercase tracking-widest border border-slate-100">
                    Step {uiStep} of {totalSteps}
                </span>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight tracking-tight">
                    What was your biggest motivation?
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 max-w-4xl mx-auto">
                {options.map(opt => (
                    <div
                        key={opt.id}
                        onClick={() => updateData({ motivation: opt.id })}
                        className={`group relative cursor-pointer bg-white rounded-[2rem] p-6 border-2 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center gap-4 ${data.motivation === opt.id ? 'border-blue-600 shadow-xl shadow-blue-500/20 ring-4 ring-blue-50' : 'border-slate-100 shadow-sm hover:border-blue-200'}`}
                    >
                        <div className="h-32 w-full flex items-center justify-center p-4">
                            <img
                                alt={opt.id}
                                className={`transition-all object-contain h-full drop-shadow-sm ${data.motivation === opt.id ? 'opacity-100 scale-110' : 'opacity-80 grayscale group-hover:grayscale-0 group-hover:scale-105'}`}
                                src={opt.img}
                            />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-widest text-center ${data.motivation === opt.id ? 'text-blue-700' : 'text-slate-500 group-hover:text-slate-800'}`}>
                            {opt.id}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-200 max-w-4xl mx-auto">
                <button onClick={onBack} className="text-slate-500 hover:text-slate-700 font-bold text-xs uppercase tracking-widest px-4 py-2 flex items-center gap-2 transition-colors">
                    <span className="material-icons-round text-base">arrow_back</span> Back
                </button>
                <button onClick={onNext} className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-[0.2em] px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 transform active:scale-95">
                    Next <span className="material-icons-round text-base">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

export default MotivationStep;
