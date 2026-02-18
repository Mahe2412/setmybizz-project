import Link from 'next/link';


export const Navbar = () => {
    return (
        <nav className="border-b border-slate-200 py-4 px-6 fixed top-0 w-full bg-white/80 backdrop-blur-md z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {/* Logo Placeholder - Text for now */}
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
                        SetMyBizz
                    </span>
                </div>
                <div className="hidden md:flex gap-6 items-center">
                    <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">Services</Link>
                    <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">Processes</Link>
                    <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">About Us</Link>
                </div>
                <div>
                    {/* Simple button for now, can be replaced with shadcn/ui button if available or regular button */}
                    <Link href="/onboarding/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg">
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
}
