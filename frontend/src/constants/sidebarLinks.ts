import { mainNavDataType, settingNavDataType } from "@/types";

export const mainNavData: mainNavDataType = [
  {
    name: "Calendar",
    path: "/calendar",
    icon: "IoCalendarOutline",
    iconLibrary: "io5",
  },
  {
    name: "My Task",
    path: "/my-task",
    icon: "MdTaskAlt",
    iconLibrary: "md",
  },
  {
    name: "Tags",
    path: "/tags",
    icon: "IoPricetagsOutline",
    iconLibrary: "io5",
  },
  {
    name: "Settings",
    path: "/settings",
    icon: "MdOutlineSettings",
    iconLibrary: "md",
  },
];

export const settingNavData: settingNavDataType = [
  {
    name: "Details",
    path: "/profile-details"
  },
  {
    name: "Personal",
    path: "/personal-details"
  },
  {
    name: "Appearance",
    path: "/appearance"
  },
  {
    name: "Account",
    path: "/account-details"
  },
];

