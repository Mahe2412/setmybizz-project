import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GST Copilot by SetMyBizz — AI-Powered GST Filing',
  description: 'File your GSTR-1, GSTR-3B and GST Annual returns with AI. India\'s smartest GST compliance platform for MSMEs.',
};

export default function GSTCopilotLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a14]">
      {children}
    </div>
  );
}
