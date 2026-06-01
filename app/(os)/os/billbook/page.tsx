'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Deep link: open Bill Book inside BizOS workspace */
export default function BillBookOSRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('bizos_open_tab', 'billbook');
    }
    router.replace('/os');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-slate-500">
      Opening Bill Book…
    </div>
  );
}
