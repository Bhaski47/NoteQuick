"use client";
import { useUserStore } from "@/store/useUserStore";
import Divider from "@/utils/Divider";
import { getCookie } from "@/utils/getCookie";
import InputButton from "@/utils/InputButton";
import { Button } from "@heroui/react";
import axios from "axios";
import React, { useState } from "react";

export default function PersonalContent() {
  const storeName = useUserStore((s) => s.name);
  const storeGender = useUserStore((s) => s.gender);
  const storeBirthday = useUserStore((s) => s.birthday);
  const storeCity = useUserStore((s) => s.city);
  const storeCountry = useUserStore((s) => s.country);
  const storePhone = useUserStore((s) => s.phone);

  const setStoreName = useUserStore((s) => s.setName);
  const setStoreGender = useUserStore((s) => s.setGender);
  const setStoreBirthday = useUserStore((s) => s.setBirthday);
  const setStoreCity = useUserStore((s) => s.setCity);
  const setStoreCountry = useUserStore((s) => s.setCountry);
  const setStorePhone = useUserStore((s) => s.setPhone);

  const [name, setName] = useState(storeName ?? "");
  const [gender, setGender] = useState(storeGender ?? "");
  const [birthday, setBirthday] = useState(storeBirthday ?? "");
  const [city, setCity] = useState(storeCity ?? "");
  const [country, setCountry] = useState(storeCountry ?? "");
  const [phone, setPhone] = useState(storePhone ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const hasChanges =
    name !== (storeName ?? "") ||
    gender !== (storeGender ?? "") ||
    birthday !== (storeBirthday ?? "") ||
    city !== (storeCity ?? "") ||
    country !== (storeCountry ?? "") ||
    phone !== (storePhone ?? "");

  return (
    <main className="">
      <div className=" py-8 px-4 sm:px-8 ">
        <header className="text-lg font-bold">Personal Details</header>
        <p className="font-bold text-textSecondary">
          Edit and manage your personal information
        </p>
      </div>
      <Divider />
      <div className="py-8 px-4 sm:px-8 flex flex-col">
        <header className="text-lg font-bold">Basic Info</header>
        <p className="font-bold sm:w-1/4 text-textSecondary min-w-0">
          Some info may be visible to other people
        </p>
        <div className="flex flex-row w-4/2 gap-x-52 gap-y-3 flex-wrap mt-5">
          <InputButton
            placeholder="Name"
            value={storeName}
            onChange={(e) => setName(e.target.value)}
          />
          <InputButton
            placeholder="Gender"
            value={storeGender}
            onChange={(e) => setGender(e.target.value)}
          />
          <InputButton
            placeholder="Birthday"
            value={storeBirthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
          <InputButton
            placeholder="City"
            value={storeCity}
            onChange={(e) => setCity(e.target.value)}
          />
          <InputButton
            placeholder="Country"
            value={storeCountry}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
      </div>
      <Divider />
      <div className="py-8 px-4 sm:px-8 flex flex-col">
        <header className="text-lg font-bold">Contact Info</header>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <p className="font-bold sm:w-1/4 text-textSecondary min-w-0">
            Some info may be visible to other people
          </p>
        </div>
        <InputButton
          placeholder="Phone"
          value={storePhone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <Divider />
      {hasChanges && (
        <div className="flex justify-end gap-10 w-10/12 my-6">
          <Button color="default" variant="bordered" className="rounded-lg">
            Cancel
          </Button>
          <Button
            color="default"
            variant="bordered"
            className="rounded-lg bg-light-buttonPrimary dark:bg-dark-buttonPrimary text-white border-light-buttonPrimary dark:border-x-dark-buttonPrimary"
            isLoading={isLoading}
            onPress={async () => {
              setIsLoading(true);
              const token = getCookie("token");
              await axios.put(
                `${process.env.host}/user/updateUserDetails`,
                {
                  name,
                  gender,
                  birthday,
                  city,
                  country,
                  phone,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );
              setStoreName(name);
              setStoreGender(gender);
              setStoreBirthday(birthday);
              setStoreCity(city);
              setStoreCountry(country);
              setStorePhone(phone);
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
