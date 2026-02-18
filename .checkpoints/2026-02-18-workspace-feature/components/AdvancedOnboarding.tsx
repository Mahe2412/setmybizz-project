'use client';

import { useState } from 'react';
import { IndustryType, BusinessSize, BusinessProfile } from '@/types/workspace';

interface AdvancedOnboardingProps {
    onComplete: (profile: BusinessProfile) => void;
}

export default function AdvancedOnboarding({ onComplete }: AdvancedOnboardingProps) {
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState<Partial<BusinessProfile>>({
        challenges: [],
        gaps: [],
        goals: [],
        salesChannels: [],
        currentTools: [],
        leadSources: []
    });

    const totalSteps = 8;

    const updateProfile = (data: Partial<BusinessProfile>) => {
        setProfile(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            // Complete onboarding
            onComplete(profile as BusinessProfile);
        }
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const progressPercent = (step / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
            <div className="max-w-3xl w-full">

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Step {step} of {totalSteps}</span>
                        <span className="text-sm font-medium text-indigo-600">{Math.round(progressPercent)}% Complete</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-2xl shadow-xl p-8">

                    {step === 1 && (
                        <Step1_BusinessName
                            value={profile.businessName}
                            onChange={(name: string) => updateProfile({ businessName: name })}
                            onNext={nextStep}
                        />
                    )}

                    {step === 2 && (
                        <Step2_Industry
                            value={profile.industry}
                            onChange={(industry: IndustryType) => updateProfile({ industry })}
                            onNext={nextStep}
                            onBack={prevStep}
                        />
                    )}

                    {step === 3 && (
                        <Step3_BusinessSize
                            value={profile.size}
                            teamSize={profile.teamSize}
                            onChange={(size: BusinessSize, teamSize: any) => updateProfile({ size, teamSize })}
                            onNext={nextStep}
                            onBack={prevStep}
                        />
                    )}

                    {step === 4 && (
                        <Step4_ProductService
                            value={profile.productService}
                            onChange={(productService: string) => updateProfile({ productService })}
                            onNext={nextStep}
                            onBack={prevStep}
                        />
                    )}

                    {step === 5 && (
                        <Step5_Challenges
                            challenges={profile.challenges || []}
                            gaps={profile.gaps || []}
                            onChange={(challenges: string[], gaps: string[]) => updateProfile({ challenges, gaps })}
                            onNext={nextStep}
                            onBack={prevStep}
                        />
                    )}

                    {step === 6 && (
                        <Step6_SalesMarketing
                            salesChannels={profile.salesChannels || []}
                            leadSources={profile.leadSources || []}
                            avgLeads={profile.averageLeads}
                            onChange={(data: any) => updateProfile(data)}
                            onNext={nextStep}
                            onBack={prevStep}
                        />
                    )}

                    {step === 7 && (
                        <Step7_CurrentTools
                            currentTools={profile.currentTools || []}
                            onChange={(currentTools: string[]) => updateProfile({ currentTools })}
                            onNext={nextStep}
                            onBack={prevStep}
                        />
                    )}

                    {step === 8 && (
                        <Step8_Goals
                            goals={profile.goals || []}
                            businessAge={profile.businessAge}
                            growthStage={profile.growthStage}
                            onChange={(data: any) => updateProfile(data)}
                            onNext={nextStep}
                            onBack={prevStep}
                        />
                    )}

                </div>
            </div>
        </div>
    );
}

// Step 1: Business Name
function Step1_BusinessName({ value, onChange, onNext }: any) {
    const [name, setName] = useState(value || '');

    const handleNext = () => {
        if (name.trim()) {
            onChange(name);
            onNext();
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome! 👋</h2>
                <p className="text-gray-600">Let's set up your AI-powered workspace. First, what's your business name?</p>
            </div>

            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your business name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-lg"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleNext()}
            />

            <button
                onClick={handleNext}
                disabled={!name.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Continue →
            </button>
        </div>
    );
}

// Step 2: Industry Selection
function Step2_Industry({ value, onChange, onNext, onBack }: any) {
    const [selected, setSelected] = useState<IndustryType | undefined>(value);

    const industries: { value: IndustryType; label: string; icon: string; desc: string }[] = [
        { value: 'ecommerce', label: 'E-Commerce', icon: '🛍️', desc: 'Online store & retail' },
        { value: 'pharma', label: 'Pharmaceutical', icon: '💊', desc: 'Medicine & healthcare' },
        { value: 'saas', label: 'SaaS & Software', icon: '💻', desc: 'Software products' },
        { value: 'manufacturing', label: 'Manufacturing', icon: '🏭', desc: 'Production & factory' },
        { value: 'retail', label: 'Retail Store', icon: '🏪', desc: 'Physical store' },
        { value: 'services', label: 'Professional Services', icon: '💼', desc: 'Consulting, agency' },
        { value: 'food', label: 'Food & Beverage', icon: '🍽️', desc: 'Restaurant, cafe' },
        { value: 'education', label: 'Education', icon: '🎓', desc: 'School, training' },
        { value: 'healthcare', label: 'Healthcare', icon: '🏥', desc: 'Clinic, medical' },
        { value: 'finance', label: 'Financial Services', icon: '💰', desc: 'Banking, investment' },
        { value: 'real-estate', label: 'Real Estate', icon: '🏢', desc: 'Property business' },
        { value: 'other', label: 'Other', icon: '📋', desc: 'General business' }
    ];

    const handleNext = () => {
        if (selected) {
            onChange(selected);
            onNext();
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">What's your industry? 🏢</h2>
                <p className="text-gray-600">This helps us recommend the right tools for your business</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {industries.map((industry) => (
                    <button
                        key={industry.value}
                        onClick={() => setSelected(industry.value)}
                        className={`p-4 border-2 rounded-xl text-left transition-all ${selected === industry.value
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="text-3xl mb-2">{industry.icon}</div>
                        <div className="font-semibold text-gray-900 text-sm">{industry.label}</div>
                        <div className="text-xs text-gray-500">{industry.desc}</div>
                    </button>
                ))}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    disabled={!selected}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}

// Step 3: Business Size
function Step3_BusinessSize({ value, teamSize, onChange, onNext, onBack }: any) {
    const [selected, setSelected] = useState<BusinessSize | undefined>(value);
    const [team, setTeam] = useState(teamSize || { total: 1 });

    const sizes: { value: BusinessSize; label: string; range: string }[] = [
        { value: 'solo', label: 'Solo', range: '1 person' },
        { value: 'micro', label: 'Micro', range: '2-5 people' },
        { value: 'small', label: 'Small', range: '6-20 people' },
        { value: 'medium', label: 'Medium', range: '21-50 people' },
        { value: 'large', label: 'Large', range: '50+ people' }
    ];

    const handleNext = () => {
        if (selected) {
            onChange(selected, team);
            onNext();
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">How big is your team? 👥</h2>
                <p className="text-gray-600">We'll suggest tools that fit your team size and budget</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {sizes.map((size) => (
                    <button
                        key={size.value}
                        onClick={() => setSelected(size.value)}
                        className={`p-4 border-2 rounded-xl text-center transition-all ${selected === size.value
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="font-semibold text-gray-900">{size.label}</div>
                        <div className="text-sm text-gray-500">{size.range}</div>
                    </button>
                ))}
            </div>

            {selected && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Team Members
                    </label>
                    <input
                        type="number"
                        value={team.total}
                        onChange={(e) => setTeam({ ...team, total: parseInt(e.target.value) || 1 })}
                        min="1"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                    />
                </div>
            )}

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    disabled={!selected}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}

// Step 4: Product/Service
function Step4_ProductService({ value, onChange, onNext, onBack }: any) {
    const [text, setText] = useState(value || '');

    const handleNext = () => {
        if (text.trim()) {
            onChange(text);
            onNext();
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">What do you sell? 🎯</h2>
                <p className="text-gray-600">Tell us about your products or services</p>
            </div>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="E.g., Organic shampoo and skincare products, Digital marketing services, Pharmaceutical wholesale..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none resize-none"
                rows={4}
                autoFocus
            />

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    disabled={!text.trim()}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}

// Step 5: Challenges & Gaps
function Step5_Challenges({ challenges, gaps, onChange, onNext, onBack }: any) {
    const [selectedChallenges, setSelectedChallenges] = useState<string[]>(challenges);
    const [customChallenge, setCustomChallenge] = useState('');

    const commonChallenges = [
        'Lead generation',
        'Sales conversion',
        'Customer support',
        'Inventory management',
        'Payment collection',
        'Marketing automation',
        'Team collaboration',
        'Financial tracking',
        'Compliance & regulations',
        'Time management'
    ];

    const toggleChallenge = (challenge: string) => {
        if (selectedChallenges.includes(challenge)) {
            setSelectedChallenges(selectedChallenges.filter(c => c !== challenge));
        } else {
            setSelectedChallenges([...selectedChallenges, challenge]);
        }
    };

    const addCustom = () => {
        if (customChallenge.trim() && !selectedChallenges.includes(customChallenge)) {
            setSelectedChallenges([...selectedChallenges, customChallenge]);
            setCustomChallenge('');
        }
    };

    const handleNext = () => {
        onChange(selectedChallenges, selectedChallenges); // Using same for gaps
        onNext();
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">What challenges are you facing? 🤔</h2>
                <p className="text-gray-600">Select all that apply - this helps us find the right solutions</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {commonChallenges.map((challenge) => (
                    <button
                        key={challenge}
                        onClick={() => toggleChallenge(challenge)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedChallenges.includes(challenge)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {selectedChallenges.includes(challenge) ? '✓ ' : ''}{challenge}
                    </button>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={customChallenge}
                    onChange={(e) => setCustomChallenge(e.target.value)}
                    placeholder="Add your own challenge..."
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && addCustom()}
                />
                <button
                    onClick={addCustom}
                    className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-all"
                >
                    Add
                </button>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}

// Step 6: Sales & Marketing
function Step6_SalesMarketing({ salesChannels, leadSources, avgLeads, onChange, onNext, onBack }: any) {
    const [channels, setChannels] = useState<string[]>(salesChannels);
    const [sources, setSources] = useState<string[]>(leadSources);
    const [leads, setLeads] = useState(avgLeads || 0);

    const channelOptions = ['Online Store', 'Physical Store', 'WhatsApp', 'Phone Calls', 'Email', 'Social Media', 'Marketplaces'];
    const sourceOptions = ['Website', 'Social Media', 'Referrals', 'Ads', 'Walk-ins', 'Cold Calling', 'Events'];

    const handleNext = () => {
        onChange({ salesChannels: channels, leadSources: sources, averageLeads: leads });
        onNext();
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sales & Marketing 📈</h2>
                <p className="text-gray-600">How do you sell and get customers?</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sales Channels</label>
                <div className="flex flex-wrap gap-2">
                    {channelOptions.map((channel) => (
                        <button
                            key={channel}
                            onClick={() => setChannels(prev =>
                                prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
                            )}
                            className={`px-3 py-1 rounded-full text-sm ${channels.includes(channel)
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700'
                                }`}
                        >
                            {channels.includes(channel) ? '✓ ' : ''}{channel}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lead Sources</label>
                <div className="flex flex-wrap gap-2">
                    {sourceOptions.map((source) => (
                        <button
                            key={source}
                            onClick={() => setSources(prev =>
                                prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
                            )}
                            className={`px-3 py-1 rounded-full text-sm ${sources.includes(source)
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-700'
                                }`}
                        >
                            {sources.includes(source) ? '✓ ' : ''}{source}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Average monthly leads (approx.)
                </label>
                <input
                    type="number"
                    value={leads}
                    onChange={(e) => setLeads(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g., 50"
                />
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}

// Step 7: Current Tools
function Step7_CurrentTools({ currentTools, onChange, onNext, onBack }: any) {
    const [tools, setTools] = useState<string[]>(currentTools);
    const [customTool, setCustomTool] = useState('');

    const commonTools = ['Excel/Sheets', 'WhatsApp', 'Gmail', 'Tally', 'Zoho', 'QuickBooks', 'None'];

    const toggleTool = (tool: string) => {
        if (tools.includes(tool)) {
            setTools(tools.filter(t => t !== tool));
        } else {
            setTools([...tools, tool]);
        }
    };

    const addCustom = () => {
        if (customTool.trim() && !tools.includes(customTool)) {
            setTools([...tools, customTool]);
            setCustomTool('');
        }
    };

    const handleNext = () => {
        onChange(tools);
        onNext();
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">What tools do you use today? 🛠️</h2>
                <p className="text-gray-600">We can integrate with your existing tools</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {commonTools.map((tool) => (
                    <button
                        key={tool}
                        onClick={() => toggleTool(tool)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tools.includes(tool)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {tools.includes(tool) ? '✓ ' : ''}{tool}
                    </button>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={customTool}
                    onChange={(e) => setCustomTool(e.target.value)}
                    placeholder="Add other tool..."
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && addCustom()}
                />
                <button
                    onClick={addCustom}
                    className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-all"
                >
                    Add
                </button>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}

// Step 8: Goals
function Step8_Goals({ goals, businessAge, growthStage, onChange, onNext, onBack }: any) {
    const [selectedGoals, setSelectedGoals] = useState<string[]>(goals);
    const [age, setAge] = useState(businessAge || 'startup');
    const [stage, setStage] = useState(growthStage || 'launch');

    const goalOptions = [
        'Increase sales',
        'Save time',
        'Reduce costs',
        'Better customer service',
        'Scale operations',
        'Automate workflows',
        'Improve analytics',
        'Team collaboration'
    ];

    const toggleGoal = (goal: string) => {
        if (selectedGoals.includes(goal)) {
            setSelectedGoals(selectedGoals.filter(g => g !== goal));
        } else {
            setSelectedGoals([...selectedGoals, goal]);
        }
    };

    const handleNext = () => {
        onChange({ goals: selectedGoals, businessAge: age, growthStage: stage });
        onNext();
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">What are your goals? 🎯</h2>
                <p className="text-gray-600">Final step! Tell us what you want to achieve</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {goalOptions.map((goal) => (
                    <button
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedGoals.includes(goal)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {selectedGoals.includes(goal) ? '✓ ' : ''}{goal}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Age</label>
                    <select
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                    >
                        <option value="startup">Just starting</option>
                        <option value="1-2 years">1-2 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5+ years">5+ years</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Growth Stage</label>
                    <select
                        value={stage}
                        onChange={(e) => setStage(e.target.value as any)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                    >
                        <option value="ideation">Ideation</option>
                        <option value="launch">Launch</option>
                        <option value="growth">Growth</option>
                        <option value="scale">Scale</option>
                        <option value="mature">Mature</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                    Complete Setup 🚀
                </button>
            </div>
        </div>
    );
}
