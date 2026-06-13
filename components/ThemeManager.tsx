"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { syncThemeForPath } from "@/lib/theme";

export default function ThemeManager() {
  const pathname = usePathname();

  useEffect(() => {
    syncThemeForPath(pathname);
  }, [pathname]);

  return null;
}
