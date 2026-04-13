"use client";
import { NavigateButtonProps } from "@/types";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
}: NavigateButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  function handleClick() {
    // const newPath = path.startsWith("/settings") ? path : `/settings${path}`;
    router.push(path);
    // router.push(path);
  }

  const isSettings =
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
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
      onClick={handleClick}
      className={`flex items-center gap-7 w-full py-2 mb-6 rounded-md text-lg font-bold text-left px-4
    border border-light-borderPrimary dark:border-dark-borderPrimary 
    hover:bg-light-buttonHover dark:hover:bg-dark-buttonHover hover:text-white hover:transition-all hover:ease-in-out hover:duration-250
    ${isSettings ? selectedClassName : unSelectedClassName} 
  `}
    >
      {Icon && <Icon size={28} />}
      <p>{name}</p>
    </motion.button>
  );
}
