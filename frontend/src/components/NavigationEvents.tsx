"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";

export default function NavigationEvents() {
  const pathname = usePathname();

  useEffect(() => {
    // Whenever the route pathname changes, ensure the loader completes smoothly
    NProgress.done();
  }, [pathname]);

  return null;
}
