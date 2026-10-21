"use client";

import { ThemeTransitionProvider } from "@/components/transitions/theme-transition";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeTransitionProvider transition="circle-blur">{children}</ThemeTransitionProvider>;
}
