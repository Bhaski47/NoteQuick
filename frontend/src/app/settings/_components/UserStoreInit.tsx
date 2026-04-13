"use client";
import { useUserStore } from "@/store/useUserStore";
import { User } from "@/types";
import { useEffect } from "react";

export default function UserStoreInit({ user }: { user: User }) {
  const setName = useUserStore((s) => s.setName);
  const setGender = useUserStore((s) => s.setGender);
  const setBirthday = useUserStore((s) => s.setBirthday);
  const setCity = useUserStore((s) => s.setCity);
  const setCountry = useUserStore((s) => s.setCountry);
  const setPhone = useUserStore((s) => s.setPhone);
  const setEmail = useUserStore((s) => s.setEmail);
  const setUserName = useUserStore((s) => s.setUserName);

  useEffect(() => {
    setName(user.name ?? "");
    setGender(user.gender ?? "");
    setBirthday(user.birthday ?? "");
    setCity(user.city ?? "");
    setCountry(user.country ?? "");
    setPhone(user.phone ?? "");
    setEmail(user.email ?? "");
    setUserName(user.username ?? "");
  }, [user]);

  return null;
}