"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      className="min-h-11 rounded-lg border border-navy/30 px-4 font-medium text-navy"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.replace("/admin/login");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}