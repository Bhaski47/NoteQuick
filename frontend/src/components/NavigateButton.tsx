"use client";

import { NavigateButtonProps } from "@/types";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NProgress from "nprogress";
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import * as BsIcons from "react-icons/bs";
import * as IO5Icons from "react-icons/io5";

export default function NavigateButton({
  name,
  path,
  icon,
  iconLibrary,
  unSelectedClassName,
  selectedClassName,
  className,
}: NavigateButtonProps) {
  const pathname = usePathname() || "";
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    setNavigating(false);
  }, [pathname]);

  const isActive =
    pathname.startsWith(path) ||
    pathname.split("/")[1] === path.split("/")[1] ||
    pathname.split("/").pop() === path.split("/").pop();

  const iconLibraries: Record<
    string,
    Record<string, React.ComponentType<{ size?: number }>>
  > = {
    md: MdIcons,
    fa: FaIcons,
    bs: BsIcons,
    io5: IO5Icons,
  };

  const Icon = iconLibrary && icon ? iconLibraries[iconLibrary][icon] : null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === path) {
      e.preventDefault();
      return;
    }
    setNavigating(true);
    NProgress.start();
  };

  const defaultClasses =
    "gap-5 w-full py-2 mb-4 border border-light-borderPrimary dark:border-dark-borderPrimary rounded-md text-light-textPrimary dark:text-dark-textPrimary text-base font-semibold text-left px-4 hover:bg-light-buttonHover dark:hover:bg-dark-buttonHover hover:text-white transition-all duration-200";

  return (
    <Link
      href={path}
      onClick={handleClick}
      className={`flex items-center ${
        className || defaultClasses
      } ${isActive ? selectedClassName : unSelectedClassName} ${
        navigating
          ? "opacity-80 ring-2 ring-light-buttonPrimary/40 dark:ring-dark-buttonPrimary/40"
          : ""
      }`}
    >
      {Icon && <Icon size={24} />}
      <span className="flex-1 truncate">{name}</span>
      {navigating && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0 ml-2" />
      )}
    </Link>
  );
}
