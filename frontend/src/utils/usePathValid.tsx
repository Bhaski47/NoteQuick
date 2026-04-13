'use client'
import { usePathname } from "next/navigation";

export default function usePathValid(name: string) {
  const router = usePathname();
  return router.includes(name);
}
