"use client";
import { Tab, Tabs } from "@heroui/tabs";
import { useEffect, useState } from "react";
import DetailsContent from "./DetailsContent";
import PersonalContent from "./PersonalContent";
import AppearanceContent from "./AppearanceContent";
import AccountContent from "./AccountContent";
import { TabNavigateProps } from "@/types";
import { useUserStore } from "@/store/useUserStore";

export default function TabNavigate({ userDetails }: TabNavigateProps) {
  console.log("userDetails");
  console.log(userDetails);
  
  const [activeKey, setActiveKey] = useState<string>("Details");
  const setEmail = useUserStore((s) => s.setEmail);
  const setUserName = useUserStore((s) => s.setUserName);
  const setPhone = useUserStore((s) => s.setPhone);
  const setCity = useUserStore((s) => s.setCity);
  const setCountry = useUserStore((s) => s.setCountry);
  const setBirthday = useUserStore((s) => s.setBirthday);
  const setDescription = useUserStore((s) => s.setDescription);
  const setGender = useUserStore((s) => s.setGender);

  useEffect(() => {
    setEmail(userDetails.email);
    setUserName(userDetails.username);
    setPhone(userDetails.phone ?? "");
    setCity(userDetails.city ?? "");
    setCountry(userDetails.country ?? "");
    setBirthday(userDetails.birthday ?? "");
    setDescription(userDetails.description ?? "");
    setGender(userDetails.gender ?? "");
  }, []);

  return (
    <div>
      <div className="overflow-y-scroll scrollbar-hide sm:w-full">
        <Tabs
          variant={"underlined"}
          style={{ marginLeft: "1%", marginRight: "1%" }}
          classNames={{
            cursor: "border-black dark:border-dark-buttonPrimary border-b-2",
          }}
          selectedKey={activeKey}
          onSelectionChange={(k) => setActiveKey(k as string)}
        >
          <Tab key="Details" title="Details" style={{ fontSize: "1.1rem" }} />
          <Tab key="Personal" title="Personal" style={{ fontSize: "1.1rem" }} />
          <Tab
            key="Appearance"
            title="Appearance"
            style={{ fontSize: "1.1rem" }}
          />
          <Tab key="Account" title="Account" style={{ fontSize: "1.1rem" }} />
        </Tabs>
        <div className="border border-light-borderDivider dark:border-dark-borderDivider -mt-1 w-full sm:w-full" />
      </div>
      <section className="">
        {activeKey === "Details" && (
          <DetailsContent />
        )}
        {activeKey === "Personal" && <PersonalContent />}
        {activeKey === "Appearance" && <AppearanceContent />}
        {activeKey === "Account" && (
          <AccountContent userDetails={userDetails} />
        )}
      </section>
    </div>
  );
}
