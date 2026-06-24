import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "SetMyBizz BizDesk | Complete Business Operations, CA & Legal Compliance Suite",
  description:
    "Run your startup backend on autopilot. BizDesk by SetMyBizz integrates online CA tax filings, MCA ROC compliance tracking, Pvt Ltd incorporation, and corporate banking dashboard.",
  keywords: [
    'bizdesk', 'setmybizz bizdesk', 'business operations dashboard', 'CA compliance portal', 
    'startup back office', 'business dashboard india', 'company registration tracking', 
    'legal compliance software', 'online CA filings', 'corporate operations suite'
  ],
};

export default function BizdeskLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
