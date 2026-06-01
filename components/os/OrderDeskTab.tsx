"use client";

import SocialOrderDesk from "@/components/billease/SocialOrderDesk";

/** BizDesk feature: WhatsApp / Instagram order workflow for MSME D2C */
export default function OrderDeskTab() {
  return (
    <div className="-mx-3 -mt-3 md:-mx-5 md:-mt-5 h-[calc(100vh-8rem)] min-h-[560px]">
      <SocialOrderDesk />
    </div>
  );
}
