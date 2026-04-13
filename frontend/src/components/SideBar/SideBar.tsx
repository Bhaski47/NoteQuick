"use client";

import { mainNavData } from "@/constants/sidebarLinks";
import React, { useState } from "react";
import NavigateButton from "../NavigateButton";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import NameBox from "./NameBox";
import LogOutButton from "./LogOutButton";

export default function SideBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ✅ Mobile Top Bar */}
      <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b dark:border-dark-borderDivider">
        <h1 className="text-xl font-bold">NOTEQUICK</h1>
        <HiOutlineMenuAlt1
          size={26}
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        />
      </div>

      {/* ✅ Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* ✅ Sidebar */}
      <aside
        className={`
        fixed z-50 top-0 left-0 h-dvh w-[75%] max-w-[280px]
        bg-light-backgroundColor dark:bg-dark-backgroundColor
        border-r border-light-borderDivider dark:border-dark-borderDivider
        px-5 pt-5 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        
        ${open ? "translate-x-0" : "-translate-x-full"}
        
        sm:translate-x-0 sm:w-[15vw] sm:flex
      `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-textPrimary">
            NOTEQUICK
          </h1>

          {/* Close button (mobile only) */}
          <span
            className="sm:hidden cursor-pointer text-xl"
            onClick={() => setOpen(false)}
          >
            ✕
          </span>
        </div>

        {/* Navigation */}
        <main className="flex-1">
          {mainNavData.map((item, index) => (
            <NavigateButton
              key={index}
              name={item.name}
              path={item.path}
              icon={item.icon}
              iconLibrary={item.iconLibrary as "md5" | "io5"}
              selectedClassName="text-white bg-light-buttonActive dark:bg-dark-buttonActive"
              className="hover:bg-light-buttonHover dark:hover:bg-dark-buttonHover hover:text-white gap-5 w-full 
              py-2 mb-4 border border-light-borderPrimary dark:border-dark-borderPrimary 
              rounded-md text-light-textPrimary dark:text-dark-textPrimary 
              text-base font-semibold text-left px-4 transition-all duration-200"
              unSelectedClassName=""
            />
          ))}
        </main>

        {/* Footer */}
        <div className="w-full">
          <LogOutButton />
          <NameBox />
        </div>
      </aside>
    </>
  );
}