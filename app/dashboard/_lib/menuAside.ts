import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiPalette,
  mdiVuejs,
  mdiBitcoin,
  mdiChat
} from "@mdi/js";
import { MenuAsideItem } from "../../_interfaces";

export const menuAside: MenuAsideItem[] = [
  {
    href: "/dashboard",
    icon: mdiMonitor,
    label: "Dashboard",
  },
  {
    href: "/dashboard/crypto",
    icon: mdiBitcoin,
    label: "Crypto",
  },
  {
    href: "/dashboard/tables",
    label: "Tables",
    icon: mdiTable,
  },
  {
    href: "/dashboard/forms",
    label: "Forms",
    icon: mdiSquareEditOutline,
  },

  {
    href: "/dashboard/chat",
    label: "Chat",
    icon: mdiChat,
  },

  {
    label: "Gird",
    icon: mdiViewList,
    menu: [
      {
        label: "Config Gird",
        href: "/dashboard/gird/create_gird",
      },
       {
        label: "Load Gird",
        href: "/dashboard/gird/data_gird",
      },
    ],
  },
  {
    href: "/dashboard/ui",
    label: "UI",
    icon: mdiTelevisionGuide,
  },
  {
    href: "/dashboard/responsive",
    label: "Responsive",
    icon: mdiResponsive,
  },
  {
    href: "/",
    label: "Styles",
    icon: mdiPalette,
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: mdiAccountCircle,
  },
  {
    href: "/login",
    label: "Login",
    icon: mdiLock,
  },
  {
    href: "/error",
    label: "Error",
    icon: mdiAlertCircle,
  },
  {
    label: "Dropdown",
    icon: mdiViewList,
    menu: [
      {
        label: "Item One",
      },
      {
        label: "Item Two",
      },
    ],
  },
  {
    href: "https://github.com/justboil/admin-one-react-tailwind",
    label: "GitHub",
    icon: mdiGithub,
    target: "_blank",
  },
  {
    href: "https://github.com/justboil/admin-one-vue-tailwind",
    label: "Vue version",
    icon: mdiVuejs,
    target: "_blank",
  },
];

export default menuAside;
