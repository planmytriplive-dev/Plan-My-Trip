"use client";

import { useEffect, useState } from "react";

export function ReviewNotice() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem("pmt-review-submitted")) {
        window.sessionStorage.removeItem("pmt-review-submitted");
        setVisible(true);
      }
    } catch { /* Storage is optional. */ }
  }, []);
  if (!visible) return null;
  return <p role="status" className="mt-5 rounded-xl bg-mist p-4 text-sm font-semibold text-navy">Your review is live. Thanks for sharing your experience.</p>;
}
