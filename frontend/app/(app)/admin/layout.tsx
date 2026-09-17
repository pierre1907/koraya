"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/token";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (getCurrentUser()?.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }
    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
