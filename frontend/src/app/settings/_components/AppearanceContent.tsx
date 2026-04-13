"use client";
import { useTheme } from "@/context/ThemeContext";
import { Theme } from "@/types";
import Divider from "@/utils/Divider";
import { Radio, RadioGroup } from "@heroui/react";
import React from "react";

export default function AppearanceContent() {
  const { theme, setTheme } = useTheme();

  return (
    <main className="flex flex-col w-full sm:w-full overflow-hidden">
      <div className="w-full py-8 px-4 sm:px-8">
        <header className="text-lg font-bold">Appearance</header>
        <p className="font-bold text-textSecondary">
          Edit and manage your customization here
        </p>
      </div>
      <Divider />
      <div className="py-8 px-4 sm:px-8 flex flex-col">
        <header className="text-lg font-bold">Interface Theme</header>
        <div className="flex flex-col sm:flex-row">
          <p className="font-bold sm:w-1/4 text-textSecondary min-w-0">
            Select or customize your UI Theme
          </p>
          <RadioGroup
            orientation="horizontal"
            classNames={{
              wrapper:
                "flex flex-wrap gap-x-6 gap-y-4 items-start pt-4 sm:pt-0",
            }}
            value={theme}
            onChange={(e) => {
              const selectedTheme = e.target.value as Theme | "system";
              console.log("Selected theme:", selectedTheme);
              setTheme(selectedTheme);
            }}
          >
            <Radio color="danger" value="system">
              System Preference
            </Radio>
            <Radio color="success" value="light">
              Light Mode
            </Radio>
            <Radio color="secondary" value="dark">
              Dark Mode
            </Radio>
          </RadioGroup>
        </div>
        {/* <div className="flex pt-6 flex-row items-center">
          <header className="text-lg font-bold">Enable Theme 47</header>
          <Tooltip content="I am a tooltip" showArrow={true}>
            <AiOutlineQuestionCircle
              style={{ marginLeft: "0.5rem" }}
              size={20}
            />
          </Tooltip>
          <label className="relative inline-flex items-center cursor-pointer ml-4">
            <input type="checkbox" value="" className="sr-only peer" />
            <div
              className="group peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-300 w-14 h-7 shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none
       after:content-['✖️'] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-5 after:w-5 after:top-1 after:left-1 after:flex after:justify-center after:items-center after:text-xs 
       peer-checked:after:translate-x-7 peer-checked:after:content-['✔️'] peer-hover:after:scale-95"
            ></div>
          </label>
        </div> */}
      </div>
      <Divider />
    </main>
  );
}
