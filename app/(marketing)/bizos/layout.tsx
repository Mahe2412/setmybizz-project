import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "SetMyBizz BizOS | The World's First AI Business Operating System (BizOS)",
  description:
    "Meet the World's First AI Business Operating System (BizOS). Empowering founders with the World's First AI Co-Founder and AI Startup LaunchPad to build logos, launch websites, and manage legal compliance.",
  keywords: [
    'bizos', 'setmybizz bizos', 'AI business OS', 'AI co founder', 'AI startup builder', 
    'no code startup launcher', 'business operating system', 'business automation suite',
    'automated company registration', 'startup brand designer'
  ],
};

export default function BizosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
