import Link from 'next/link';

interface ServiceCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
}

export const ServiceCard = ({ title, description, icon, href }: ServiceCardProps) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">{description}</p>

            <div className="flex items-center text-blue-600 font-semibold text-sm group/link">
                <span className="mr-2">Get Started</span>
                <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        </div>
    );
}
