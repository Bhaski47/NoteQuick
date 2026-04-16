"use client";
import Divider from "@/utils/Divider";
import React, { useState } from "react";
import { Textarea } from "@heroui/input";
import StaticInput from "@/utils/StaticInput";
import { Button } from "@heroui/react";
import { useUserStore } from "@/store/useUserStore";
import axios from "axios";
import { getCookie } from "@/utils/getCookie";

export default function DetailsContent() {
  const storeDescription = useUserStore((s) => s.description);
  const setStoreDescription = useUserStore((s)=> s.setDescription);
  const userName = useUserStore((s) => s.userName);
  const [description, setDescription] = useState(storeDescription);
  const hasChanges = description !== storeDescription;
  const [isLoading, setIsLoading] = useState(false);
  return (
    <main className=" w-full">
      <div className="py-8 px-4 sm:px-8 overflow-hidden">
        <header className="text-lg font-bold">Profile Details</header>
        <p className="font-bold text-textSecondary">
          You can change your profile settings here seamlessly.
        </p>
      </div>
      <Divider />
      <div className="py-8 px-4 sm:px-8 flex flex-col">
        <header className="text-lg font-bold">Public Profile</header>
        <div className="flex flex-col sm:flex-row gap-4">
          <p className="font-bold sm:w-1/4 text-textSecondary min-w-0">
            This is the main profile that will be visible for everyone
          </p>
          <StaticInput
            placeholder=""
            label="https://notequick.vercel.app/user/"
            inputValue={userName}
          />
        </div>
      </div>
      <Divider />
      <div className="py-8 px-4 sm:px-8 flex flex-col">
        <header className="text-lg font-bold">Bio Description</header>
        <div className="flex flex-col sm:flex-row gap-4">
          <p className="font-bold sm:w-1/4 text-textSecondary min-w-0">
            This will be your short story so keep it short.
          </p>
          <Textarea
            disableAnimation
            disableAutosize
            classNames={{
              base: "max-w-sm mt-[-10px] ",
              input: "resize-y max-h-[10rem] min-h-[5rem]",
            }}
            placeholder="Enter your description"
            variant="bordered"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <Divider />
      {hasChanges && (
        <div className="flex justify-end gap-10 w-10/12 py-6">
          <Button color="default" variant="bordered" className=" rounded-lg">
            Cancel
          </Button>
          <Button
            color="default"
            variant="bordered"
            className=" rounded-lg bg-light-buttonPrimary dark:bg-dark-buttonPrimary text-white border-light-buttonPrimary dark:border-x-dark-buttonPrimary"
            isLoading={isLoading}
            onPress={async () => {
              setIsLoading(true);
              const token = getCookie("token");
              await axios.put(
                `${process.env.host}/user/updateUserDetails`,
                {
                  description
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );
              setStoreDescription(description)
              setIsLoading(false);
            }}
          >
            Save Changes
          </Button>
        </div>
      )}
    </main>
  );
}
